export type Tag = {
    id: number
    name: string
}

export type Todo = {
    id: number
    content: string
    due_date: string
    tags?: Tag[]
    done: boolean
}

export type User = {
    id: number
    name: string
    email: string
    email_verified_at: string
}

export type LoginFormProps = {
    onLogin: (user: User) => void
}
