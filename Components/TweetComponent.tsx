import React, { useEffect, useState } from 'react'
import { Comment, CommentBody, Tweet } from '../typing'
import TimeAgo from 'react-timeago'
import {
    ChatAlt2Icon,
    HeartIcon,
    SwitchHorizontalIcon,
    UploadIcon
} from '@heroicons/react/outline'
import { fetchComments } from '../utils/fetchComments'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'



interface Props {
    tweet: Tweet,
    handleReferesh: () => {}
}
function TweetComponent({ tweet, handleReferesh }: Props) {

    const [comments, setComments] = useState<Comment[]>([])
    const [commetBoxVisible, setCommentBoxVisible] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const { data: session } = useSession()
    let copyTweetlikes = [].concat(tweet.likes)




    const refreshCommets = async () => {
        const comments: Comment[] = await fetchComments(tweet._id)
        setComments(comments)
    }

    useEffect(() => {
        refreshCommets()
    }, [])

    const postComment = async () => {
        const commentInfo: CommentBody = {
            comment: input,
            username: session?.user?.name || 'Unknown user',
            profileImage: session?.user?.image || 'https://links.papareact.com/gll',
            tweetId: tweet._id
        }

        const result = await fetch(`/api/addComment`, {
            body: JSON.stringify(commentInfo),
            method: 'POST',
        })

        const json = await result.json()

        const newComments = await fetchComments(tweet._id);

        setComments(newComments)

        toast('Tweet,posted')
        return json
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        postComment()

        setInput('')

        setCommentBoxVisible(false)

    }

    const PatchLikes = async () => {
        const Likes = {
            _id: tweet._id,
            likes: copyTweetlikes

        }


        const result = await fetch(`/api/addLikes`, {
            body: JSON.stringify(Likes),
            method: 'POST',
        })

        const json = await result.json()
        console.log(json);
        //console.log(tweet.likes);


        return json
    }

    const handleLikes = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        handleReferesh()
        if (copyTweetlikes.includes(session?.user?.name)) {

            console.log(copyTweetlikes, 'pro1');
            copyTweetlikes = copyTweetlikes.filter(user => (user != session?.user?.name) && (user != undefined || null))

            console.log(copyTweetlikes, 'procees2');

            PatchLikes()
            toast('Disliked')



        } else {
            console.log(copyTweetlikes, 'procees3');

            copyTweetlikes.push(session?.user?.name)

            console.log(copyTweetlikes, 'procees4');

            PatchLikes()
            toast('Liked')

        }


        handleReferesh()

        copyTweetlikes = []

    }


    return (
        <div className='flex flex-col space-x-3 border-y p-5 border-gray-100'>
            <div className='flex space-x-3'>
                <img className="h-10 w-10 rounded-full object-cover" src={tweet.profileImage} alt="" />
                <div>
                    <div className='flex items-center space-x-1'>
                        <p className='mr-1 font-bold'>{tweet.username}</p>
                        <p className='hidden text-sm text-gray-500 sm:inline'>@{tweet.username.replace(/\s+/g, '').toLowerCase()} . </p>
                        <TimeAgo className="text-sm text-gray-500" date={tweet._createdAt} />
                    </div>
                    <p>{tweet.text}</p>
                    {tweet.image && <img src={tweet.image} alt="" className='m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm' />}
                </div>
            </div>
            <div className='mt-5 flex justify-between'>
                <div onClick={() => session && setCommentBoxVisible(!commetBoxVisible)} className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <ChatAlt2Icon className='h-5 w-5' />
                    <p>{comments.length}</p>
                </div>

                <div onClick={handleLikes} className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <HeartIcon className='h-5 w-5' />
                    <p>{tweet.likes?.length}</p>
                </div>

                <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <SwitchHorizontalIcon className='h-5 w-5' />
                    <p>10</p>
                </div>

                <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <UploadIcon className='h-5 w-5' />
                </div>
            </div>

            {commetBoxVisible && (
                <form onSubmit={handleSubmit} className='mt-3 flex space-x-3'>
                    <input value={input} onChange={e => setInput(e.target.value)} className='flex-1 rounded-lg bg-gray-100 p-2 outline-none' type="text" placeholder="write a commnet..." />
                    <button disabled={!input} type="submit" className='text-twitter disabled:text-gray-200'>Post</button>
                </form>
            )
            }

            {comments?.length > 0 && (

                <div className='my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5'>

                    {

                        comments.map((comment) => (

                            <div key={comment._id} className='flex relative space-x-2'>
                                <hr className='absolute left-5 top-10 h-8 border-x border-twitter/30' />
                                <img src={comment.profileImage} alt="" className='mt-2 h-7 w-7 object-cover rounded-full' />

                                <div>
                                    <div className='flex items-center space-x-1'>
                                        <p className='mr-1 font-bold'>{comment.username}</p>
                                        <p className='hidden text-sm text-gray-500 lg:inline'>@{comment.username.replace(/\s+/g, '').toLowerCase()} .</p >
                                        <TimeAgo className="text-sm text-gray-500" date={comment._createdAt} />
                                    </div>
                                    <p>{comment.comment}</p>
                                </div>

                            </div>
                        ))
                    }
                </div>
            )
            }
        </div >
    )
}

export default TweetComponent