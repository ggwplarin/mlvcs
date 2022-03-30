import { NextPage } from "next";
import { useUser } from "@lib/hooks";
const SettingsAccount: NextPage = () => {
    const { user, mutate } = useUser({ redirectTo: "/login" })
    return (
        <div>

        </div>
    )
}

export default SettingsAccount