import React from 'react'
import { Box, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import HomeIcon from '@mui/icons-material/Home'

interface TodoToolbarProps {
    onAddClick: () => void
    onHomeClick: () => void
}

const TodoToolbar: React.FC<TodoToolbarProps> = ({ onAddClick, onHomeClick }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                p: 2,
                zIndex: 1300,
                display: 'flex',
                justifyContent: 'center',
                '& > :not(style)': { m: 1 },
            }}
        >
            {/* 追加ボタン */}
            <Fab color="primary" aria-label="add" onClick={onAddClick}>
                <AddIcon />
            </Fab>

            {/* ホームに戻るボタン */}
            <Fab variant="extended" onClick={onHomeClick}>
                <HomeIcon sx={{ mr: 1 }} />
                Home
            </Fab>
        </Box>
    )
}

export default TodoToolbar
