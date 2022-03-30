import React from 'react'

type Props = {
    title: string
}

const Tab: React.FC<Props> = ({ children }) => {
    return <>{children}</>
}

export default Tab