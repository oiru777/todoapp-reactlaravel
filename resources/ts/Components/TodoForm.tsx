import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// 日本語ロケールなら
import { ja } from 'date-fns/locale';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import NavigationIcon from '@mui/icons-material/Navigation';


const TodoForm: React.FC = () => {
    const [content, setContent] = useState("");
    const [due_date, setDueDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // 送信（日付も一緒に送るならここで送る）
            const response = await axios.post("/api/todo", { content, due_date: due_date.toISOString().split("T")[0] });
            setMessage("追加しました");
            setContent("");
            navigate("/show");
        } catch (error) {
            setMessage("追加失敗");
        }
    };

    return (
        <>
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Todoリスト追加
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
                label="締切日"
                value={due_date}
                onChange={(newDate) => setDueDate(newDate)}
                slotProps={{
                    textField: {
                    fullWidth: true,
                    margin: "normal"
                    }
                }}
            />
            </LocalizationProvider>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="ToDo入力"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    追加
                </Button>
            </form>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/show")}
                sx={{ mt: 2 }}
            >
                一覧ページへ
            </Button>
            {message && (
                <Typography variant="body2" color="textSecondary">
                    {message}
                </Typography>
            )}
        </Box>


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
    '& > :not(style)': { m: 1 }, // 子要素(Fab)にマージン付ける
  }}>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Fab variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        タグ検索
      </Fab>
    </Box>
</>
    );
};

export default TodoForm;