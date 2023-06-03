'use client'

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
    isLast?: boolean;
    data: FullMessageType
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
    const session = useSession()
    const [imageModalOpen, setImageModalOpen] = useState(false)

    const isOwn = session?.data?.user?.email === data?.sender?.email
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)

    const container = clsx('flex gap-2 p-0.5', isOwn && "justify-end")

    const avatar = clsx('self-end', isOwn && "order-2")

    const body = clsx("flex flex-col gap-0.5", isOwn && "items-end")

    const message = clsx("text-sm w-fit overflow-hidden",
        isOwn ? "bg-messenger text-white" : 'bg-gray-200 ',
        data.image ? "rounded-md p-0" : "rounded-full py-2 px-3.5")

    return (
        <div className={container}>
            {!isOwn && (
                <div className={avatar}>
                    <Avatar user={data.sender} type="message" />
                </div>
            )}

            <div className={body}>
                {!isOwn && (
                    <div className="flex items-center gap-1">
                        <div className="ml-3 text-xs text-gray-500">
                            {data.sender.name}
                        </div>
                        <div className="text-xs text-gray-400">
                            {format(new Date(data.createdAt), 'p')}
                        </div>
                    </div>
                )}

                <div className={message}>
                    <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
                    {data.image ? (
                        <Image onClick={() => setImageModalOpen(true)} alt="Image" width={288} height={288} src={data.image} className="object-cover cursor-pointer hover:scale-110 transition" />
                    ) : (
                        <div>
                            {data.body}
                        </div>
                    )}
                </div>

                {/* {isLast && isOwn && seenList.length > 0 && (<div className="flex self-end">
                    {seenList.map((user) => (
                        <div key={user.id} className="mx-[1px]">
                            <Avatar type="seen" user={user} />
                        </div>
                    ))}
                </div>)} */}
            </div>
        </div>
    )
}

export default MessageBox