import React from 'react'
import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Button, Box } from '@mui/material'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import AssignmentIcon from '@mui/icons-material/Assignment'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CancelIcon from '@mui/icons-material/Cancel'
import type { Todo } from '.././types'

type TodoItemProps = {
    todo: Todo
    onEdit: (todo: Todo) => void
    onDelete: (id: number) => void
    onToggleDone: (todo: Todo) => void
    onToggleUnDone: (todo: Todo) => void
    onTagClick: (tagName: string) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
    todo,
    onEdit,
    onDelete,
    onToggleDone,
    onToggleUnDone,
    onTagClick,
}) => {
    const today = new Date()
    const dueDate = new Date(todo.due_date)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffText = diffDays < 0 ? `${Math.abs(diffDays)}日過ぎました` : `あと${diffDays}日`

    return (
        <ListItem
            key={todo.id}
            secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {todo.done ? (
                        <IconButton edge="end" aria-label="cancel" onClick={() => onToggleUnDone(todo)}>
                            <CancelIcon />
                        </IconButton>
                    ) : (
                        <IconButton edge="end" aria-label="check" onClick={() => onToggleDone(todo)}>
                            <CheckIcon />
                        </IconButton>
                    )}
                    <IconButton edge="end" aria-label="edit" onClick={() => onEdit(todo)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(todo.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            }
        >
            <ListItemAvatar>
                <Avatar
                    sx={{
                        bgcolor: todo.done ? 'success.main' : diffDays < 0 ? 'error.main' : 'primary.main',
                    }}
                >
                    {todo.done ? (
                        <AssignmentTurnedInIcon />
                    ) : diffDays < 0 ? (
                        <AssignmentLateIcon />
                    ) : (
                        <AssignmentIcon />
                    )}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={todo.content}
                secondary={
                    <>
                        締切: {dueDate.toLocaleDateString('ja-JP')}（{diffText}）<br />
                        {todo.tags && todo.tags.length > 0 && (
                            <span>
                                タグ:{' '}
                                {todo.tags.map((tag, index) => (
                                    <Button
                                        key={index}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mr: 1, mb: 0.5, fontSize: '0.75rem', padding: '2px 6px' }}
                                        onClick={() => onTagClick(tag.name)}
                                    >
                                        {tag.name}
                                    </Button>
                                ))}
                            </span>
                        )}
                    </>
                }
            />
        </ListItem>
    )
}
