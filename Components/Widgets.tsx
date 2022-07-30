import React from 'react'
import { TwitterTimelineEmbed } from 'react-twitter-embed';

import {
    SearchIcon
} from "@heroicons/react/outline"

export default function Widgets() {
    return (
        <div className='px-2 mt-2 hidden lg:inline col-span-2'>

            <div className='flex items-center space-x-2 bg-gray-100 p-3 rounded-full mt-2 '>
                <SearchIcon className='h-5 w-5 text-gray-400' />
                <input
                    type="text"
                    className="bg-transparent flex-1 outline-none"
                    placeholder="search Twitter"></input>
            </div>

            <TwitterTimelineEmbed
                sourceType="profile"
                screenName="elonmusk"
                options={{ height: 1000 }}
            />
        </div>
    )
}
