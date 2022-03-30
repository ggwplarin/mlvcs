import { NextPage } from "next";
import { useUser } from "@lib/hooks";
import { useRouter } from "next/router";
import Tabs from "@components/Tabs";
import Tab from "@components/Tabs/Tab";
import dynamic from "next/dynamic";

const UserPage: NextPage = () => {
    const { user, mutate } = useUser()
    const router = useRouter()
    const { username } = router.query
    return (
        <>



            {/* {username == user.username ? (
                <>

                </>
            ) : (
                <>

                </>)} */}
        </>
    )
}

export default UserPage