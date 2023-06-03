'use client'

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client"
import { useMemo, useState } from "react";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import Avatar from "@/app/components/Avatar";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
    const otherUser = useOtherUser(conversation)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const statusText = useMemo(() => {
        if (conversation.isGroup) return `${conversation.users.length} members`

        return 'Active'
    }, [conversation])

    return (
        <div>
            <ProfileDrawer data={conversation} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <div className="bg-white w-full flex border-p-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
                <div className="flex gap-3 items-center">
                    <Link className="lg:hidden block text-messenger transition cursor-pointer" href='/conversations' >
                        <HiChevronLeft size={32}></HiChevronLeft>
                    </Link>
                    {conversation.isGroup ? (<AvatarGroup users={conversation.users} />) : (<Avatar user={otherUser} type='conversation' />)}

                    <div className="flex flex-col">
                        <div className="text-sm font-semibold text-gray-900">
                            {conversation.name || otherUser.name}
                        </div>
                        <div className="text-sm font-light text-neutral-500">
                            {statusText}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center rounded-full hover:bg-gray-100 transition">
                    <HiEllipsisHorizontal size={24} onClick={() => setDrawerOpen(true)}
                        className="rounded-full m-3 cursor-pointer bg-messenger text-white" />
                </div>

            </div>
        </div>

    )
}

export default Header