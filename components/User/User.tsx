

import React, { ReactElement, useState } from "react"
import styles from "@styles/User.module.scss"
import Image from "next/image"
import Link from "next/link"
type Props = {
    user: any
}

const User: React.FC<Props> = ({ user }) => {

    return (
        <div className={styles.userBlock}>
            {user && <div className={styles.block}>
                <img className={styles.avatar} src={user?.avatar || "https://avatars.githubusercontent.com/u/39963694?v=4"} />
                <a className={styles.username}>{user?.username}</a>
            </div>}
            {!user && <div className={styles.block}>
                <Link href="/login"><a className={styles.signin}>Вход</a></Link>
                <Link href="/signup"><a className={styles.signup}>Регистрация</a></Link>
            </div>}
        </div>
    )
}

export default User