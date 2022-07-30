export default {
  name: 'tweet',
  title: 'Tweet',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'text in tweet',
      type: 'string',
    },
    {
      name: 'blockTweet',
      title: 'Block Tweet',
      descrption: 'ADMIN Controls:Toggle if Tweet is deemed inappropriate',
      type: 'boolean',

    },
    {
      name: 'username',
      title: 'Username',
      type: 'string',
    },
    {
      name: 'profileImage',
      title: 'Profile image',
      type: 'string'
    },
    {
      name: 'image',
      title: 'Tweet image',
      type: 'string'
    },
    {
      name: 'likes',
      title: 'Tweet Likes',
      type: 'array',
      of: [ 
      {
        type: 'string'
      }
    ]
    }

  ]
}
