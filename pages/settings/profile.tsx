import { NextPage } from "next";
import { useUser } from "@lib/hooks";
const SettingsProfile: NextPage = () => {
    const { user, mutate } = useUser({ redirectTo: "/login" })
    return (
        <div>

        </div>
    )
}

export default SettingsProfile