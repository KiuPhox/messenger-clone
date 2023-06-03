import getCurrentUser from "@/app/actions/getCurrentUser"
import Avatar from "@/app/components/Avatar"
import { User } from "@prisma/client"
import { useSession } from "next-auth/react"

interface SeenBoxProps {
    users: User[]
}

const SeenBox: React.FC<SeenBoxProps> = ({ users }) => {
    const session = useSession()
    const seenList = (users || [])
        .filter((user) => user.email !== session?.data?.user?.email)
    return (
        <div>
            {seenList.length > 0 && (<div className="flex justify-end">
                {seenList.map((user) => (
                    <div key={user.id} className="mx-[1px]">
                        <Avatar type="seen" user={user} />
                    </div>
                ))}
            </div>

            )}
        </div>
    )
}

export default SeenBox