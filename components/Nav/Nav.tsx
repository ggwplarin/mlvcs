

import React, { ReactElement, useState } from "react"
import styles from "@styles/Nav.module.scss"
import Image from "next/image"
import Link from "next/link"
type Props = {
    children: ReactElement[]
}

const Nav: React.FC<Props> = ({ children }) => {
    return (
        <div className={styles.navBlock}>
            {children.map((item, index) => (
                <div className={styles.navItem} key={index}>
                    <Link href={item.props.href}><a className={styles.navItemTitle}>{item.props.title}</a></Link>
                </div>
            ))}
        </div>
    )
}

export default Nav