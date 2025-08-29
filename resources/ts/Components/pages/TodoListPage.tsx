import React, { useState } from 'react'
import axios from 'axios'
import { Box, Typography, CircularProgress } from '@mui/material'
import { AddTodoModal } from '../modals/AddTodoModal'
import { EditTodoForm } from '../EditTodoForm'
import { SwitchDoneModal } from '../modals/SwitchDoneModal'
import { TodoList } from '../TodoList'
import { TodoToolbar } from '../TodoToolbar'
import { useNavigate } from 'react-router-dom'
import { useTodos } from '../../hooks/useTodos'
import type { Todo } from '../../types'

interface Props {
    title: string
    fetchUrl: string
    initialTag?: string
}

export const TodoListPage: React.FC<Props> = ({ title, fetchUrl, initialTag }) => {
    const { todos, setTodos, loading, fetchTodos } = useTodos(fetchUrl)
    const navigate = useNavigate()

    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showDoneForm, setShowDoneForm] = useState(false)
    const [showUnDoneForm, setShowUnDoneForm] = useState(false)
    const [doneTarget, setDoneTarget] = useState<Todo | null>(null)

    const [newContent, setNewContent] = useState('')
    const [newTags, setNewTags] = useState(initialTag || '')
    const [newDueDate, setNewDueDate] = useState<Date | null>(new Date())
    const [message, setMessage] = useState('')

    // 編集開始
    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo)
        setNewContent(todo.content)
        setNewDueDate(new Date(todo.due_date))
        const tagString = (todo.tags ?? [])
            .map((tag) => tag.name.trim())
            .filter(Boolean)
            .join(',')
        setNewTags(tagString)
        scrollToTop()
        console.log(todo)
    }

    // 編集保存
    const handleUpdate = async () => {
        if (!editingTodo) return
        try {
            await axios.put(`/api/todo/${editingTodo.id}`, {
                content: newContent,
                due_date: newDueDate?.toISOString().split('T')[0],
                tags: newTags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            })
            setEditingTodo(null)
            setNewContent('')
            setNewDueDate(null)
            setNewTags('')
            fetchTodos()
        } catch (e) {
            console.error('更新失敗:', e)
        }
    }

    // ToDo追加
    const handleAddTodo = async () => {
        if (!newContent || !newDueDate) {
            setMessage('内容と締切日を入力してください')
            return
        }
        try {
            await axios.post('/api/todo', {
                content: newContent,
                due_date: newDueDate.toISOString().split('T')[0],
                tags: newTags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            })
            setMessage('追加しました')
            setShowAddForm(false)
            setNewContent('')
            setNewDueDate(new Date())
            setNewTags(initialTag || '')
            fetchTodos()
        } catch (e) {
            console.error(e)
            setMessage('追加失敗')
        }
    }

    // 完了・未完了に切り替える
    const handleToggleDone = async (done: boolean) => {
        if (!doneTarget) return
        try {
            await axios.put(`/api/todo/${doneTarget.id}`, {
                content: doneTarget.content,
                due_date: new Date(doneTarget.due_date).toISOString().split('T')[0], // ← 'YYYY-MM-DD' 形式に
                done: done,
                tags: doneTarget.tags?.map((tag) => tag.name) ?? [], // ← タグを name の配列に変換
            })
            fetchTodos()
        } catch (e) {
            console.error(`${done ? '完了' : '未完了'}状態の更新失敗`, e)
        } finally {
            setDoneTarget(null)
            setShowDoneForm(false)
            setShowUnDoneForm(false)
            setMessage('')
        }
    }

    // todo削除
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/todo/${id}`)
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
        } catch (e) {
            console.error('削除失敗:', e)
        }
    }
    //タグ検索ページに遷移して、クエリにタグ名を渡す
    const handleTagClick = (tagName: string) => {
        navigate(`/tag/${tagName}`)
    }

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    if (loading) return <CircularProgress />

    return (
        <>
            <Box sx={{ maxWidth: 500, mx: 'auto', mb: 10, mt: 4, backgroundColor: '#ffffff' }}>
                <Typography variant="h4" gutterBottom>
                    {title}
                </Typography>
                {/* todo編集記入欄、編集ボタン押した時のみ表示 */}
                {editingTodo && (
                    <EditTodoForm
                        content={newContent}
                        dueDate={newDueDate}
                        tags={newTags}
                        onChangeContent={setNewContent}
                        onChangeDueDate={setNewDueDate}
                        onChangeTags={setNewTags}
                        onSave={handleUpdate}
                        onCancel={() => {
                            setEditingTodo(null)
                            setNewContent('')
                            setNewDueDate(null)
                            setNewTags('')
                        }}
                    />
                )}

                {/* todo一覧表示とアクションボタン（完了・編集・削除）*/}
                <TodoList
                    todos={todos}
                    onEdit={(todo) => {
                        handleEdit(todo)
                        scrollToTop()
                    }}
                    onDelete={handleDelete}
                    onToggleDone={(todo) => {
                        setDoneTarget(todo)
                        setShowDoneForm(true)
                        setMessage('')
                    }}
                    onToggleUnDone={(todo) => {
                        setDoneTarget(todo)
                        setShowUnDoneForm(true)
                        setMessage('')
                    }}
                    onTagClick={handleTagClick}
                />
            </Box>
            {/* 画面下のFab（追加、ホーム） */}
            <TodoToolbar
                onAddClick={() => {
                    setShowAddForm(true)
                    setNewContent('')
                    setNewDueDate(new Date())
                    setMessage('')
                    setNewTags(initialTag || '')
                }}
                onHomeClick={() => {
                    navigate('/')
                    scrollToTop()
                }}
            />
            {/* todo追加モーダル、FAB押した時に表示 */}
            <AddTodoModal
                open={showAddForm}
                onClose={() => setShowAddForm(false)}
                newContent={newContent}
                newTags={newTags}
                newDueDate={newDueDate}
                setNewContent={setNewContent}
                setNewTags={setNewTags}
                setNewDueDate={setNewDueDate}
                handleAddTodo={handleAddTodo}
                message={message}
            />
            {/* 未完了->完了に切り替えるモーダル、未完了の時だけ表示 */}
            <SwitchDoneModal
                open={showDoneForm}
                onClose={() => setShowDoneForm(false)}
                onConfirm={() => handleToggleDone(true)}
                targetLabel="完了"
                message={message}
            />
            {/* 完了->未完了に切り替えるモーダル、完了の時だけ表示 */}
            <SwitchDoneModal
                open={showUnDoneForm}
                onClose={() => setShowUnDoneForm(false)}
                onConfirm={() => handleToggleDone(false)}
                targetLabel="未完了"
                message={message}
            />
        </>
    )
}
