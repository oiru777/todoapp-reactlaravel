import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { ja } from 'date-fns/locale'

interface EditTodoFormProps {
    content: string
    dueDate: Date | null
    tags: string
    onChangeContent: (value: string) => void
    onChangeDueDate: (date: Date | null) => void
    onChangeTags: (value: string) => void
    onSave: () => void
    onCancel: () => void
}

const EditTodoForm: React.FC<EditTodoFormProps> = ({
    content,
    dueDate,
    tags,
    onChangeContent,
    onChangeDueDate,
    onChangeTags,
    onSave,
    onCancel,
}) => {
    return (
        <Box sx={{ mb: 2 }}>
            <TextField fullWidth margin="normal" value={content} onChange={(e) => onChangeContent(e.target.value)} />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
                <DatePicker
                    label="締切日"
                    value={dueDate}
                    onChange={onChangeDueDate}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: 'normal',
                        },
                    }}
                />
            </LocalizationProvider>
            <TextField
                label="タグを入力（カンマ区切りで記入）"
                value={tags}
                onChange={(e) => onChangeTags(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button variant="contained" color="primary" onClick={onSave} fullWidth>
                    保存
                </Button>
                <Button variant="outlined" color="secondary" onClick={onCancel} fullWidth>
                    キャンセル
                </Button>
            </Box>
        </Box>
    )
}

export default EditTodoForm
