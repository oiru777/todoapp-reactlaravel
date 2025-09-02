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
}

export type LoginFormProps = {
    onLogin: (user: User) => void
}
