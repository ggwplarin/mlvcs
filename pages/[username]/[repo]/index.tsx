import { NextPage } from "next";
import { useRouter } from 'next/router'
import Search from "@components/Search"
import Tabs from "@components/Tabs";
import Tab from "@components/Tabs/Tab";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useUser } from "@lib/hooks";
import styles from "@styles/Repo.module.scss"


const RepoPage: NextPage = () => {
    const { user, mutate: mutateUser } = useUser()
    const fetcher = (url: string) =>
        fetch(url, { method: 'GET', headers: { key: user.key, name: repo as string, user: username as string } })
            .then((r) => r.json())
            .then((data: any) => {
                console.log('Fetched repo data:')
                console.log(data?.repo)
                return { repo: data?.repo }
            })
    const { data: data, mutate: mutateRepo } = useSWR(`/api/repos`, fetcher)
    const router = useRouter()
    const { username, repo } = router.query
    const RepoPath = dynamic(() => import('@components/RepoHeading'))
    return (
        <>
            <RepoPath user={username} repo={repo} />
            <Tabs>
                <Tab title="Обзор">
                    <section>

                    </section>
                </Tab>
                <Tab title="Модели">
                    <section>
                        {!data && <a className={styles.modelVersionFilename}>Загрузка...</a>}
                        <ul>
                            {
                                data?.repo?.modelsVersions?.map((el: any) => {
                                    return (<li key={el.id} className={styles.modelVersionContainer}>
                                        <a className={styles.modelVersionVersion}>{el.id.slice(0, 8)}</a><a className={styles.modelVersionFilename}>{el.originalFilename}</a> <a className={styles.modelVersionDate}>{new Date(el.pushedAt).toLocaleDateString('ru-ru', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}</a> <a className={styles.modelVersionDownload} href={`/api/download/${el.fileName}`}>Скачать</a>
                                    </li>)
                                })}
                        </ul>
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

