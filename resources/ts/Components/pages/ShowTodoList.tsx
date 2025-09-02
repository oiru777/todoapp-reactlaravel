import React from 'react'
import { TodoListPage } from './TodoListPage'

export const ShowTodoList: React.FC = () => {
    return <TodoListPage title="ToDoリスト" fetchUrl="/api/todo" />
}
