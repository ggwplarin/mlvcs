import { NextPage } from "next";
import { useUser } from "@lib/hooks";
import styles from "@styles/Settings.module.scss";


const SettingsKeys: NextPage = () => {
    const { user, mutate } = useUser({ redirectTo: "/login" })
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Ключ API</h2>
            <a className={styles.text}>Ключ API</a>
            <div className={styles.keyContainer}>
                <div className={styles.keyBorder}><a className={styles.key}>{user?.key}</a></div><button className={styles.keyRollButton} onClick={async () => {
                    await fetch('/api/settings/keys', { method: 'POST', headers: { key: user.key } });
                    mutate()
                }}>Сменить</button>
            </div>
        </div>

    )
}

export default SettingsKeys