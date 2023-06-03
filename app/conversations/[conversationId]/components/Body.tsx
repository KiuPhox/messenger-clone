'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import SeenBox from "./SeenBox"
import { User } from "@prisma/client"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"

interface BodyProps {
    initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages)
    const [seenUsers, setSeenUsers] = useState<User[][]>([])

    const bottomRef = useRef<HTMLDivElement>(null)

    const { conversationId } = useConversation()

    useEffect(() => {
        const seenMap = messages.map((message) => {
            const seenWithNullM: User[] = message.seen.map((user: User) => {
                const userWithNullM: User = { ...user, conversationIds: [], seenMessageIds: [] };
                return userWithNullM;
            });
            return seenWithNullM;
        });

        let result: User[][] = [];
        for (let i = 0; i < seenMap.length; i++) {
            let temp: User[] = [];
            for (let j = 0; j < seenMap[i].length; j++) {
                let found = false;

                for (let k = i + 1; k < seenMap.length; k++) {
                    if (seenMap[k].some((el) => JSON.stringify(el) === JSON.stringify(seenMap[i][j]))) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    temp.push(seenMap[i][j]);
                }
            }
            result.push(temp);
        }

        setSeenUsers(result);
    }, [messages]);


    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])

    useEffect(() => {
        pusherClient.subscribe(conversationId)

        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessageType) => {

            axios.post(`/api/conversations/${conversationId}/seen`)

            setMessages((currrent) => {
                if (find(currrent, { id: message.id })) {
                    return currrent
                }
                return [...currrent, message]
            })
            //setSeenUsers([...seenUsers, message.seen])

            bottomRef?.current?.scrollIntoView();

        }

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((currrent) => currrent.map((currentMessage) => {
                if (currentMessage.id === newMessage.id) {
                    return newMessage
                }
                return currentMessage
            }))
        }

        pusherClient.bind('messages:new', messageHandler)
        pusherClient.bind('message:update', updateMessageHandler)

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind('messages:new', messageHandler)
            pusherClient.unbind('message:update', updateMessageHandler)
        }

    }, [conversationId])

    return (
        <div className="flex-1 overflow-y-auto mx-2">
            {messages.map((message, i) => (
                <div key={message.id}>
                    <MessageBox isLast={i === messages.length - 1} data={message} />
                    <div>
                        {
                            <SeenBox users={seenUsers[i]} />
                        }
                    </div>
                </div>

            ))}

            <div ref={bottomRef} className=""></div>
        </div>
    )
}

export default Body