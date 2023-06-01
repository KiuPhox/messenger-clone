'use client'

import { User } from "@prisma/client"
import Image from "next/image"

interface AvatarProps {
    user?: User
    type: string
}

const Avatar: React.FC<AvatarProps> = ({ user, type }) => {
    const avatarClass = () => {
        if (type === 'conversation')
            return `h-9 w-9 md:h-11 md:w-11`
        else if (type === 'user')
            return `h-6 w-6`
        else if (type === 'message')
            return `h-8 w-8`
        else if (type === 'seen')
            return `h-4 w-4`
        else if (type === 'drawer')
            return `h-20 w-20`
    }

    const dotClass = () => {
        if (type === 'conversation')
            return `h-2 w-2 md:h-3 md:w-3`
        else if (type === 'user')
            return `h-2 w-2`
    }

    return (
        <div className="relative flex items-center">
            <div className={"relative inline-block rounded-full overflow-hidden " + avatarClass()}>
                <Image alt="Avatar" src={user?.image || '/images/placeholder.jpg'} fill />
            </div>
            {type !== 'message' &&
                <span className={"absolute block rounded-full bg-green-500 ring-2 ring-white bottom-0 right-0 " + dotClass()}></span>
            }
        </div>
    )
}

export default Avatar