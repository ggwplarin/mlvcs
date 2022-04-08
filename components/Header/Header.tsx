import Search from "@components/Search"
import styles from "@styles/Header.module.scss"
import User from "@components/User"
import Link from "next/link"
import Nav from "@components/Nav"
import NavItem from "@components/Nav/NavItem"
type Props = {
    user?: any
}

function Header(props: Props) {
    return <header className={styles.header}>
        <div>
            <Search />
            <Nav>
                <NavItem href="/" title="" />
                <NavItem href="/" title="" />
            </Nav>
            <User user={props.user} />
        </div>
    </header >
}
export default Header;