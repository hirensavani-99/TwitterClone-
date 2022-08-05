// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const data = JSON.parse(req.body)


    const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`




    const result = await fetch(apiEndpoint, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`
        },
        body: JSON.stringify({
            mutations: [
                {
                    patch: {
                        id: data._id,
                        set: {
                            retweetedBy: data.retweetedBy
                        },
                    },
                },
            ],
        }),
        method: 'POST'
    })

    const json = await result.json();


    res.status(200).json({ message: 'added' })
}
