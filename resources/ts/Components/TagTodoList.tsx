import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  ListItemAvatar,
  Avatar,
  IconButton,
  Modal,
  TextField,
  Fab,
  CircularProgress,
} from "@mui/material";
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale';
import '../../css/app.css';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AddTodoModal from './AddTodoModal';
import SwitchDoneModal from './SwitchDoneModal';

interface Tag {
  id: number;
  name: string;
}

interface Todo {
  id: number;
  content: string;
  due_date: string;
  tags?: Tag[];
  done: boolean;
}

const TagTodoList: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();  // URLパラメータ取得
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newDueDate, setNewDueDate] = useState<Date | null>(new Date());
  const [message, setMessage] = useState("");
  const [doneTarget, setDoneTarget] = useState<Todo | null>(null);
  const [showDoneForm, setShowDoneForm] = useState(false);
  const [showUnDoneForm, setShowUnDoneForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleTagClick = (tagName: string) => {
    // タグ検索ページに遷移
    navigate(`/tag/${tagName}`);
  };
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`/api/tag/${tagName}/todos`);
      console.log("タグに対応するTodo一覧", res.data); 
      setTodos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  //選択されたTodoを編集モードに切り替えるための処理
  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setNewContent(todo.content);
    setNewDueDate(new Date(todo.due_date));
    // タグの名前だけの配列をセット（例: ["買い物", "重要"]）
    // todo.tags からタグ名の配列を作成
      const tagNames = todo.tags?.map(tag => tag.name) || [];

      // 必要ならカンマ区切りの string に変換
      const tagString = tagNames
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .join(',');

      // カンマ区切りで使いたいならこちらをセット
      setNewTags(tagString);

      // 文字列じゃなく配列で使いたい場合はこちら（こっちが推奨されるケース多い）
      // setNewTags(tagNames);
  };

  const handleUpdate = async () => {
    if (!editingTodo) return;
    try {
      await axios.put(`/api/todo/${editingTodo.id}`, {
        content: newContent,
        due_date: newDueDate ? newDueDate.toISOString().split("T")[0] : null,
        tags:newTags
        .split(",")                   // カンマで区切って配列に
        .map(tag => tag.trim())       // 空白を除去
        .filter(tag => tag.length > 0) // 空文字を除去
      });
      fetchTodos();
      setEditingTodo(null);
      setNewContent("");
      setNewDueDate(null);
      setNewTags("");
    } catch (e) {
      console.error("更新失敗:", e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/todo/${id}`);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (e) {
      console.error("削除失敗:", e);
    }
  };

  const handleAddTodo = async () => {
    if (!newContent || !newDueDate) {
      setMessage("内容と締切日を入力してください");
      return;
    }
    try {
      await axios.post("/api/todo", {
        content: newContent,
        due_date: newDueDate.toISOString().split("T")[0],
        tags: newTags
        .split(",")                   // カンマで区切って配列に
        .map(tag => tag.trim())       // 空白を除去
        .filter(tag => tag.length > 0) // 空文字を除去
      });
      setMessage("追加しました");
      setNewContent("");
      setNewDueDate(new Date());
      setNewTags("");
      setShowAddForm(false);
      fetchTodos();
    } catch (e) {
      setMessage("追加失敗");
      console.error(e);
    }
  };

  if (loading) return <CircularProgress />;

  // 締切日でソート
  const sortedTodos = [...todos].sort((a, b) => {
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const returnTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
    const handleConfirmDone = async () => {
  if (!doneTarget) return;
  try {
    await axios.put(`/api/todo/${doneTarget.id}`, {
      content: doneTarget.content,
      due_date: doneTarget.due_date,
      done: true,
    });
    fetchTodos();
  } catch (e) {
    console.error("完了状態の更新失敗", e);
  } finally {
    setDoneTarget(null);
    setShowDoneForm(false);
    setMessage("");
  }
};

const handleConfirmUnDone = async () => {
  if (!doneTarget) return;
  try {
    await axios.put(`/api/todo/${doneTarget.id}`, {
      content: doneTarget.content,
      due_date: doneTarget.due_date,
      done: false,
    });
    fetchTodos();
  } catch (e) {
    console.error("未完了状態の更新失敗", e);
  } finally {
    setDoneTarget(null);
    setShowUnDoneForm(false);
    setMessage("");
  }
};

  return (
    <>
    
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 , backgroundColor: '#ffffff'}}>
        <Typography variant="h4" gutterBottom>
          タグ：{tagName}
        </Typography>

        {editingTodo && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
              <DatePicker
                label="締切日"
                value={newDueDate}
                onChange={(date) => setNewDueDate(date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
                        label="タグを入力（カンマ区切りで記入）"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        fullWidth
                        margin="normal"
                        />
            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
              <Button variant="contained" color="primary" onClick={handleUpdate} fullWidth>
                保存
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingTodo(null);
                  setNewContent("");
                  setNewDueDate(null);
                  setNewTags("");
                }}
                fullWidth
              >
                キャンセル
              </Button>
            </Box>
          </Box>
        )}

        <List>
          {sortedTodos.map((todo) => {
            const today = new Date();
            const dueDate = new Date(todo.due_date);
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffText =
              diffDays < 0 ? `${Math.abs(diffDays)}日過ぎました` : `あと${diffDays}日`;

            return (
              <ListItem
                key={todo.id}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {todo.done ? (
                      <IconButton edge="end" aria-label="cancel" onClick={() => {
                      setDoneTarget(todo); 
                      setShowDoneForm(true);
                      setMessage("");
                    }}>
                      <CancelIcon />
                    </IconButton>
                    ) : <IconButton edge="end" aria-label="check" onClick={() => {
                      setDoneTarget(todo); 
                      setShowDoneForm(true);
                      setMessage("");
                    }}>
                      <CheckIcon />
                    </IconButton>
                    }
                    <IconButton edge="end" aria-label="edit" onClick={() => {
                        handleEdit(todo);
                        returnTop();
                    }}>
                      <EditIcon />
                    </IconButton>
                    <> </>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: todo.done
                        ? 'success.main'
                        : diffDays < 0
                        ? 'error.main'
                        : 'primary.main',
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
                      締切: {dueDate.toLocaleDateString("ja-JP")} （{diffText}）<br />
                      {todo.tags && todo.tags.length > 0 && (
                        <span>
                          タグ:{" "}
                          {todo.tags.map((tag, index) => (
                            <Button
                              key={index}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 0.5, fontSize: '0.75rem', padding: '2px 6px' }}
                              onClick={() => handleTagClick(tag.name)}
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
            );
          })}
        </List>
      </Box>

      {/* 画面下のFab */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          p: 2,
          zIndex: 1300,
          display: "flex",
          justifyContent: "center",
          "& > :not(style)": { m: 1 },
        }}
      >
        <Fab color="primary" aria-label="add" onClick={() => {
          setShowAddForm(true);
          setNewContent("");
          setNewDueDate(new Date());
          setMessage("");
          setNewTags(tagName || "")
        }}>
          <AddIcon />
        </Fab>
        <Fab variant="extended" onClick={() => {
            navigate("/"),returnTop();
            }}>
        <HomeIcon sx={{ mr: 1 }} />
        Home
        </Fab>
      </Box>

{/* 追加フォームモーダル */}
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
      {/*完了スイッチモーダル */}
      <SwitchDoneModal
      open={showDoneForm}
      onClose={() => setShowDoneForm(false)}
      onConfirm={handleConfirmDone}
      targetLabel="完了"
      message={message}
    />
     {/*未完了スイッチモーダル */}
    <SwitchDoneModal
      open={showUnDoneForm}
      onClose={() => setShowUnDoneForm(false)}
      onConfirm={handleConfirmUnDone}
      targetLabel="未完了"
      message={message}
    />
    </>
  );
};

export default TagTodoList;