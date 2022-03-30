

import React, { ReactElement, useState } from "react"
import styles from "@styles/Nav.module.scss"
import Image from "next/image"
import Link from "next/link"
type Props = {
    href: string
    title: string
}

const NavItem: React.FC<Props> = ({ children }) => {
    return <>{children}</>
}

export default NavItem