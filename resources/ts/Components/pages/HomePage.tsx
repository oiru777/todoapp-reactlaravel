import React, { useEffect, useState } from 'react'
import axios from 'axios'
import type { FC } from 'react'
import { ShowTodoList } from './ShowTodoList'
import { LoginPage } from './LoginPage'
import type { User, LoginFormProps } from '../../types'
import { Button, Stack, Typography, Box } from '@mui/material'

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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Typography variant="h6" component="h1">
                    ようこそ、{user.name}さん！
                </Typography>
                <Button
                    variant="outlined"
                    onClick={async () => {
                        await axios.post('http://localhost:8000/api/v1.0/logout', {}, { withCredentials: true })
                        setUser(null)
                    }}
                >
                    ログアウト
                </Button>
            </Stack>

            {/* ログインユーザー向け画面 */}
            <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
                <ShowTodoList />
            </Box>
        </Box>
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
