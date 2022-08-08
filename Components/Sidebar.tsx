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
import SidebarRow1 from "./SidebarRow1"

function Sidebar() {

    const { data: session } = useSession()


    return (
        <div className="flex flex-col col-span-2 items-center px-4 md:items-start">
            <img className="h-10 w-10" src="https://links.papareact.com/drq" alt="" />

            <SidebarRow1 Icon={HomeIcon} title="Home" />
            <SidebarRow1 Icon={HashtagIcon} title="Explore" />
            <SidebarRow1 Icon={BellIcon} title="Notification" />
            <SidebarRow1 Icon={MailIcon} title="Messages" />
            <SidebarRow1 Icon={BookmarkIcon} title="BookMark" />
            <SidebarRow1 Icon={CollectionIcon} title="Lists" />
            <SidebarRow onClick={session ? signOut : signIn} Icon={UserIcon} title={session ? "Sign out" : "Sign in"} />
            <SidebarRow1 Icon={DotsCircleHorizontalIcon} title="More" />
        </div>
    )
}

export default Sidebar