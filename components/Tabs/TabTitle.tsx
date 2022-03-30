import React, { useCallback } from "react"
import styles from "@styles/Tabs.module.scss"
type Props = {
    title: string
    index: number
    style: string
    setSelectedTab: (index: number) => void

}

const TabTitle: React.FC<Props> = ({ title, setSelectedTab, index, style }: Props) => {

    const onClick = useCallback(() => {
        setSelectedTab(index)
    }, [setSelectedTab, index])

    return (
        <li className={style} onClick={onClick}>
            <a >{title}</a>
        </li>
    )
}

export default TabTitle