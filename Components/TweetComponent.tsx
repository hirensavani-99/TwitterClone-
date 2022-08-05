import React, { useEffect, useState } from 'react'
import { Comment, CommentBody, Tweet } from '../typing'
import TimeAgo from 'react-timeago'
import {
    ChatAlt2Icon,
    HeartIcon,
    SwitchHorizontalIcon,
    UploadIcon
} from '@heroicons/react/outline'
import { SwitchHorizontalIcon as SwitchHorizontalIcon1, HeartIcon as HeartIcon1 } from '@heroicons/react/solid'
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
    let copyTweetlikes = [].concat(tweet?.likes)
    let copyReTweet = [].concat(tweet?.retweetedBy)




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

    const patchLikes = async () => {
        const Likes = {
            _id: tweet._id,
            likes: copyTweetlikes

        }


        const result = await fetch(`/api/addLikes`, {
            body: JSON.stringify(Likes),
            method: 'POST',
        })

        const json = await result.json()

        return json
    }

    const handleLikes = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        handleReferesh()
        if (copyTweetlikes.includes(session?.user?.name)) {
            copyTweetlikes = copyTweetlikes.filter(user => (user != session?.user?.name) && (user != undefined || null))
            patchLikes()
            toast('Disliked')

        } else {
            copyTweetlikes = copyTweetlikes.filter(user => user != null)
            copyTweetlikes.push(session?.user?.name)
            patchLikes()
            toast('Liked')
        }


        handleReferesh()

        copyTweetlikes = []

    }

    const patchReTweet = async () => {
        const reTweet = {
            _id: tweet._id,
            retweetedBy: copyReTweet

        }


        const result = await fetch(`/api/addReTweet`, {
            body: JSON.stringify(reTweet),
            method: 'POST',
        })

        const json = await result.json()

        return json
    }

    const handleReTweet = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        handleReferesh()
        if (copyReTweet.includes(session?.user?.name)) {
            copyReTweet = copyReTweet.filter(user => (user != session?.user?.name) && (user != undefined || null))
            patchReTweet()
            toast('ReTweet removed')

        } else {
            copyReTweet = copyReTweet.filter(user => user != null)
            copyReTweet.push(session?.user?.name)
            patchReTweet()
            toast('Retweet added')
        }


        handleReferesh()


        copyReTweet = []
    }

    return (
        <div className='flex flex-col space-x-3 border-y p-5 border-gray-100'>
            <div className='mb-5'>
                {tweet?.retweetedBy?.length > 1 && <p>re-tweeted by @{tweet?.retweetedBy[0]} and {tweet?.retweetedBy.length -1} more</p>}
                {tweet?.retweetedBy?.length === 1 && <p>re-tweeted by @{tweet?.retweetedBy[0]}</p>}
            </div>

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
                    {tweet?.likes?.includes(session?.user?.name) ? <HeartIcon1 className='h-5 w-5 text-red-500' /> : <HeartIcon className='h-5 w-5' />}

                    <p>{tweet.likes?.length}</p>
                </div>

                <div onClick={handleReTweet} className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    {tweet?.retweetedBy?.includes(session?.user?.name) ? <SwitchHorizontalIcon1 className='h-5 w-5 text-twitter' /> : <SwitchHorizontalIcon className='h-5 w-5' />}

                    <p>{tweet?.retweetedBy?.length}</p>
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
                                <img src={comment.profileImg} alt="" className='mt-2 h-7 w-7 object-cover rounded-full' />

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