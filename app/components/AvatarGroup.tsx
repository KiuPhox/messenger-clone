"use client"

import { User } from "@prisma/client"
import Image from "next/image"

interface AvatarGroupProps {
    users?: User[]
    type: string
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [], type }) => {
    const slicedUsers = users.slice(0, 2)

    const avatarClass = () => {
        if (type === 'drawer')
            return `h-20 w-20`
        return `h-8 w-8`
    }

    const positionMap = {
        0: '-bottom-0.5 -left-0.5 z-10 ring-1 ring-white',
        1: '-top-0.5 -right-0.5'
    }

    return (

        <div className="relative h-11 w-11">
            {slicedUsers.map((user, index) => (
                <div key={user.id} className={`absolute inline-block rounded-full overflow-hidden ${positionMap[index as keyof typeof positionMap]} ${avatarClass()}`}>
                    <Image alt="Avatar" fill src={user?.image || '/images/placeholder.jpg'} />
                </div>
            ))}
        </div>
    )
}

export default AvatarGroup