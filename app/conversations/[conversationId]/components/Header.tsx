'use client'

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client"
import { useMemo } from "react";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import Avatar from "@/app/components/Avatar";
import { HiEllipsisHorizontal } from "react-icons/hi2";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
    const otherUser = useOtherUser(conversation)

    const statusText = useMemo(() => {
        if (conversation.isGroup) return `${conversation.users.length} members`

        return 'Active'
    }, [conversation])

    return (
        <div className="bg-white w-full flex border-p-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center">
                <Link className="lg:hidden block text-messenger transition cursor-pointer" href='/conversations' >
                    <HiChevronLeft size={32}></HiChevronLeft>
                </Link>
                <Avatar user={otherUser} type='conversation' />
                <div className="flex flex-col">
                    <div className="text-sm font-semibold text-gray-900">
                        {conversation.name || otherUser.name}
                    </div>
                    <div className="text-sm font-light text-neutral-500">
                        {statusText}
                    </div>
                </div>
            </div>
            <HiEllipsisHorizontal size={32} onClick={() => { }}
                className=" cursor-pointer text-messenger transition" />
        </div>
    )
}

export default Header