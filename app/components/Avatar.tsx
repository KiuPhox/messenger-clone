'use client'

import { User } from "@prisma/client"
import Image from "next/image"

interface AvatarProps {
    user?: User
    type: 'conversation' | 'user'
}

const Avatar: React.FC<AvatarProps> = ({ user, type }) => {
    const sizeClass = type === 'conversation' ? `h-9 w-9 md:h-11 md:w-11` : `h-6 w-6 md:h-6 md:w-6`
    const dotSizeClass = type === 'conversation' ? `h-2 w-2 md:h-3 md:w-3` : `h-2 w-2 md:h-2 md:w-2`
    return (
        <div className="relative">
            <div className={"relative inline-block rounded-full overflow-hidden " + sizeClass}>
                <Image alt="Avatar" src={user?.image || '/images/placeholder.jpg'} fill />
            </div>
            <span className={"absolute block rounded-full bg-green-500 ring-2 ring-white bottom-1 right-0 " + dotSizeClass}></span>
        </div>
    )
}

export default Avatar