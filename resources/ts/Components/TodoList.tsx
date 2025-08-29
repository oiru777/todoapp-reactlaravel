import React from 'react'
import { List } from '@mui/material'
import { TodoItem } from './TodoItem'

interface Tag {
    id: number
    name: string
}

interface Todo {
    id: number
    content: string
    due_date: string
    tags?: Tag[]
    done: boolean
}

interface TodoListProps {
    todos: Todo[]
    onEdit: (todo: Todo) => void
    onDelete: (id: number) => void
    onToggleDone: (todo: Todo) => void
    onToggleUnDone: (todo: Todo) => void
    onTagClick: (tagName: string) => void
}

export const TodoList: React.FC<TodoListProps> = ({
    todos,
    onEdit,
    onDelete,
    onToggleDone,
    onToggleUnDone,
    onTagClick,
}) => {
    const sortedTodos = [...todos].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

    return (
        <List>
            {sortedTodos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleDone={onToggleDone}
                    onToggleUnDone={onToggleUnDone}
                    onTagClick={onTagClick}
                />
            ))}
        </List>
    )
}
