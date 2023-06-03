'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import SeenBox from "./SeenBox"
import { User } from "@prisma/client"

interface BodyProps {
    initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages)

    const bottomRef = useRef<HTMLDivElement>(null)

    const { conversationId } = useConversation()

    const seenMap = messages.map((message) => {
        const seenWithNullM: User[] = message.seen.map((user: User) => {
            const userWithNullM: User = { ...user, conversationIds: [], seenMessageIds: [] };
            return userWithNullM;
        });
        return seenWithNullM;
    })



    let result: User[][] = []

    for (let i = 0; i < seenMap.length; i++) {
        let temp: User[] = []
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


    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])

    return (
        <div className="flex-1 overflow-y-auto mx-2">
            {messages.map((message, i) => (
                <div key={message.id}>
                    <MessageBox isLast={i === messages.length - 1} data={message} />
                    <div>
                        {
                            <SeenBox users={result[i]} />
                        }
                    </div>
                </div>

            ))}
            <div ref={bottomRef} className=""></div>
        </div>
    )
}

export default Body