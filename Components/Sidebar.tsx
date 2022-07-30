import {
    BellIcon,
    HashtagIcon,
    BookmarkIcon,
    CollectionIcon,
    MailIcon,
    UserIcon,
    HomeIcon,
    DotsCircleHorizontalIcon
} from "@heroicons/react/outline"
import { signIn, signOut, useSession } from "next-auth/react"
import SidebarRow from "./SidebarRow"

function Sidebar() {

    const { data: session } = useSession()


    return (
        <div className="flex flex-col col-span-2 items-center px-4 md:items-start">
            <img className="h-10 w-10" src="https://links.papareact.com/drq" alt="" />

            <SidebarRow Icon={HomeIcon} title="Home" />
            <SidebarRow Icon={HashtagIcon} title="Explore" />
            <SidebarRow Icon={BellIcon} title="Notification" />
            <SidebarRow Icon={MailIcon} title="Messages" />
            <SidebarRow Icon={BookmarkIcon} title="BookMark" />
            <SidebarRow Icon={CollectionIcon} title="Lists" />
            <SidebarRow onClick={session ? signOut : signIn} Icon={UserIcon} title={session ? "Sign out" : "Sign in"} />
            <SidebarRow Icon={DotsCircleHorizontalIcon} title="More" />
        </div>
    )
}

export default Sidebar