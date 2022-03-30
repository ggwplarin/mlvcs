import { NextPage } from "next";
import { useRouter } from 'next/router'
import Search from "@components/Search"
import Tabs from "@components/Tabs";
import Tab from "@components/Tabs/Tab";
import dynamic from "next/dynamic";

const RepoPage: NextPage = () => {
    const router = useRouter()
    const { user, repo } = router.query
    const RepoPath = dynamic(() => import('@components/RepoHeading'))
    return (
        <>
            <RepoPath user={user} repo={repo} />
            <Tabs>
                <Tab title="Обзор">
                    <section>

                    </section>
                </Tab>
                <Tab title="Метрики">
                    <section>

                    </section>
                </Tab>
                <Tab title="Тэги">
                    <section>

                    </section>
                </Tab>
                <Tab title="Вики">
                    <section>

                    </section>
                </Tab>
            </Tabs>
        </>
    )
}

export default RepoPage

