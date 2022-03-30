import React, { ReactElement, useState } from "react"
import TabTitle from "./TabTitle"
import styles from "@styles/Tabs.module.scss"
type Props = {
    children: ReactElement[]
}

const Tabs: React.FC<Props> = ({ children }) => {
    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <>
            <ul className={styles.tabs}>
                {children.map((item, index) => (
                    <TabTitle
                        key={index}
                        title={item.props.title}
                        index={index}
                        style={selectedTab == index ? styles.tabsTitleSelected : styles.tabsTitle}
                        setSelectedTab={setSelectedTab}
                    />
                ))}
            </ul>
            {children[selectedTab]}
        </>
    )
}

export default Tabs