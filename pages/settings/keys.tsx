import { NextPage } from "next";
import { useUser } from "@lib/hooks";
const SettingsKeys: NextPage = () => {
    const { user, mutate } = useUser({ redirectTo: "/login" })
    return (
        <div>
            {user?.key}
        </div>
    )
}

export default SettingsKeys