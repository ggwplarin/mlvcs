import Search from "@components/Search"
import styles from "@styles/RepoHeading.module.scss"
import Link from "next/link"
type Props = {
    user: any
    repo: any

}

function RepoPath(props: Props) {
    return <div className={styles.headingContainer}>
        <div className={styles.path}>
            <Link href={`/${props.user}`}>
                <a className={styles.pathUser}>{props.user}</a>
            </Link>
            <a>/</a>
            <Link href={`/${props.user}/${props.repo}`}>
                <a className={styles.pathRepo}>{props.repo}</a>
            </Link>
        </div>
        <div className={styles.cloneCommand}>
            <a>mlvcs pull {props.user}/{props.repo}</a>
        </div>
    </div>
}
export default RepoPath;