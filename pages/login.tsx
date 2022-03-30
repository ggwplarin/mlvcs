import { useState } from 'react'
import Router from 'next/router'
import { useUser } from '../lib/hooks'
import Layout from '@components/Layout'
import Form from '@components/Form'

const Login = () => {
    const { mutate } = useUser({ redirectTo: '/', redirectIfFound: true })

    const [errorMsg, setErrorMsg] = useState('')

    async function handleSubmit(e: any) {
        e.preventDefault()

        if (errorMsg) setErrorMsg('')

        const body = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (res.status === 200) {
                mutate()
                Router.push('/')
            } else {
                throw new Error(await res.text())
            }
        } catch (error: any) {
            console.error('An unexpected error happened occurred:', error)
            setErrorMsg(error.message)
        }
    }

    return (
        <Layout>
            <div className="login">
                <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />
            </div>
            <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
        </Layout>
    )
}

export default Login
