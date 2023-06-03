'use client'

import { FullConversationType } from "@/app/types"
import { useCallback, useMemo } from "react"
import { Conversation, Message, User } from "@prisma/client"
import { format, formatDistance, subDays } from "date-fns"
import { useSession } from "next-auth/react"
import clsx from "clsx"
import useOtherUser from "@/app/hooks/useOtherUser"
import { useRouter } from "next/navigation"
import Avatar from "@/app/components/Avatar"
import AvatarGroup from "@/app/components/AvatarGroup"

interface ConversationBoxProps {
    data: FullConversationType
    selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
    const otherUser = useOtherUser(data)
    const session = useSession()
    const router = useRouter()

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [router, data.id])

    const lastMessage = useMemo(() => {
        const messages = data.messages || []
        return messages[messages.length - 1]
    }, [data.messages])

    const userEmail = useMemo(() => {
        return session.data?.user?.email
    }, [session.data?.user?.email])

    const hasSeen = useMemo(() => {
        if (!lastMessage)
            return false
        const seenArray = lastMessage.seen || []

        if (!userEmail)
            return false

        return seenArray.filter((user) => user.email === userEmail).length !== 0
    }, [userEmail, lastMessage])

    const lastMessageText = useMemo(() => {

        if (lastMessage?.image) {
            if (lastMessage.sender.email !== session.data?.user?.email)
                return lastMessage.sender.name + ' sent an image'
            return 'You sent an image'
        }

        if (lastMessage?.body) {
            if (lastMessage.sender.email !== session.data?.user?.email) {
                return lastMessage.body;
            }
            return "You: " + lastMessage.body
        }

        return 'Started a conversation'

    }, [lastMessage, session.data?.user?.email])

    return (
        <div className={clsx('w-full relative flex items-center space-x-3 hover:bg-neutral-200 rounded-lg transition cursor-pointer px-2 py-3',
            selected ? 'bg-neutral-100' : 'bg-white')}
            onClick={handleClick}>
            {data.isGroup ? (<AvatarGroup users={data.users} type="" />) :
                (<Avatar user={otherUser} type='conversation' />)}

            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className={clsx("text-sm text-gray-900", hasSeen ? "font-semibold" : "font-bold")}>{data.name || otherUser.name}</p>
                    </div>
                    <p className={clsx('truncate text-xs', hasSeen ? 'text-gray-500' : 'text-black font-bold')}>{lastMessageText} &#183; {lastMessage?.createdAt && formatDistance(new Date(lastMessage.createdAt), new Date()).replace('about ', '').replace('over ', '').replace('almost ', '')}</p>
                </div>
            </div>
            {!hasSeen && (<span className={"block rounded-full bg-messenger bottom-1 right-0 w-2 h-2"}></span>)}
        </div>
    )
}

export default ConversationBox