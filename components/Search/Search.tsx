import styles from '@styles/Search.module.scss'
import Link from 'next/link'
import search from 'pages/api/search'
import { useCallback, useRef, useState } from 'react'

type Props = {

}




type SearchResult = {
    id: number
    user?: string
    repo?: string
    type?: string
    docTitle?: string
    docLink?: string
}

const searchEndpoint = (query: string) => `/api/search?q=${query}`

function Search(props: Props) {
    const searchRef = useRef(null)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [active, setActive] = useState(false)

    const onChange = useCallback(async (event) => {
        const query = event.target.value
        setQuery(query)
        if (!(query === null || query.match(/^ *$/) !== null) && 64 >= query.length) {

            const res = await fetch(searchEndpoint(query))
            const json = await res.json()
            console.log(json.results)
            setResults(json.results)

        }
        else { setResults([]) }
    }, [])

    const onFocus = useCallback(async (event) => {
        setActive(true)
        window.addEventListener("click", onClick)
    }, [])

    const onClick = useCallback(async (event) => {
        //@ts-ignore
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setActive(false)
            window.removeEventListener("click", onClick)
        }
    }, [])

    return <div className={styles.searchContainer} ref={searchRef}>


        <input
            className={active && results.length > 0 ? styles.searchInputFound : styles.searchInput}
            value={query}
            type="text"
            onFocus={onFocus}
            onChange={onChange}
            placeholder="Найти..." />
        {active && results.length > 0 && (<ul className={styles.searchResultsContainer}>
            {results.map((res: SearchResult) => (
                <>
                    {res.type == "REPO" && <Link href={`/${res.user}/${res.repo}`} passHref key={res.id}>
                        <li className={styles.searchItem}>
                            <a className={styles.searchResultType}>{res.type}</a>
                            <a> {res.user} / {res.repo}</a>
                        </li>
                    </Link>}
                    {res.type == "USER" && <Link href={`/${res.user}`} passHref key={res.id}>
                        <li className={styles.searchItem}>
                            <a className={styles.searchResultType}>{res.type}</a>
                            <a> {res.user}</a>
                        </li>
                    </Link>}
                    {res.type == "DOCS" && <Link href={`/docs/${res.docLink}`} passHref key={res.id}>
                        <li className={styles.searchItem}>
                            <a className={styles.searchResultType}>{res.type}</a>
                            <a> {res.docTitle}</a>
                        </li>
                    </Link>}
                </>

            ))}
        </ul>)
        }
    </div >

}
export default Search;