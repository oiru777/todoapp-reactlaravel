import React, { useEffect, useState } from 'react'
import axios from 'axios'
import type { FC } from 'react'
import { ShowTodoList } from './ShowTodoList'
import { LoginPage } from './LoginPage'
<<<<<<< HEAD
import type { User, LoginFormProps } from '../../types'
import { Button } from '@mui/material'
=======

type User = {
    id: number
    name: string
    email: string
    // 必要に応じて他のフィールドも追加
}

type LoginFormProps = {
    onLogin: (user: User) => void
}
>>>>>>> 3ac9c0fc9924a7433de7b6dff464d0c9672ef5a4

export const HomePage: FC = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // 認証状態をチェック
    useEffect(() => {
        axios
            .get('http://localhost:8000/api/v1.0/user', { withCredentials: true })
            .then((response) => {
                setUser(response.data)
                console.log(response.data)
            })
            .catch(() => {
                setUser(null)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <LoginPage onLogin={(user: User) => setUser(user)} />
    }

    return (
        <div>
            <h1>ようこそ、{user.name}さん！</h1>
<<<<<<< HEAD
            <Button
                variant="outlined"
=======
            <button
>>>>>>> 3ac9c0fc9924a7433de7b6dff464d0c9672ef5a4
                onClick={async () => {
                    await axios.post('http://localhost:8000/api/v1.0/logout', {}, { withCredentials: true })
                    setUser(null)
                }}
            >
                ログアウト
<<<<<<< HEAD
            </Button>
=======
            </button>
>>>>>>> 3ac9c0fc9924a7433de7b6dff464d0c9672ef5a4
            {/* ログインユーザー向け画面 */}
            <ShowTodoList />
        </div>
    )
}

function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // CSRFクッキーを取得
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })
            const response = await axios.post(
                'http://localhost:8000/api/v1.0/login',
                { email, password },
                { withCredentials: true }
            )
            onLogin(response.data)
        } catch (error) {
            alert('ログイン失敗')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
            />
            <button type="submit">ログイン</button>
        </form>
    )
}
