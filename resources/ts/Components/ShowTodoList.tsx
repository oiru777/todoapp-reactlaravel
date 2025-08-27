import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Fab,
  CircularProgress,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import '../../css/app.css';
import { useNavigate } from "react-router-dom";
import AddTodoModal from './AddTodoModal';
import SwitchDoneModal from './SwitchDoneModal';
import EditTodoForm from './EditTodoForm';
import TodoList from "./TodoList";


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

const ShowTodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDoneForm, setShowDoneForm] = useState(false);
  const [showUnDoneForm, setShowUnDoneForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newDueDate, setNewDueDate] = useState<Date | null>(new Date());
  const [message, setMessage] = useState("");
  const [doneTarget, setDoneTarget] = useState<Todo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  //タグ検索ページに遷移して、クエリにタグ名を渡す
  const handleTagClick = (tagName: string) => {
    navigate(`/tag/${tagName}`);
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/todo");
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
    // todo.tags からタグ名の配列を作成
      const tagNames = todo.tags?.map(tag => tag.name) || [];

      // カンマ区切りの string に変換
      const tagString = tagNames
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .join(',');

      setNewTags(tagString);

      // 文字列じゃなく配列で使う場合
      // setNewTags(tagNames);
  };

  // todo更新
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

  // todo削除
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/todo/${id}`);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (e) {
      console.error("削除失敗:", e);
    }
  };

  // Todo追加
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
  
  //上にスクロール
  const returnTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
  //完了状態に更新
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

//未完了状態に更新
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
        {/* タイトル */}
        <Typography variant="h4" gutterBottom>
          ToDo リスト
        </Typography>
        {/* todo編集（上に表示） */}
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
              setEditingTodo(null);
              setNewContent("");
              setNewDueDate(null);
              setNewTags("");
            }}
          />
        )}
        {/* todo一覧表示とアクションボタン（完了・編集・削除）*/}
        <TodoList
          todos={todos}
          onEdit={(todo) => {
            handleEdit(todo);
            returnTop();
          }}
          onDelete={handleDelete}
          onToggleDone={(todo) => {
            setDoneTarget(todo);
            setShowDoneForm(true);
            setMessage("");
          }}
          onToggleUnDone={(todo) => {
            setDoneTarget(todo);
            setShowUnDoneForm(true);
            setMessage("");
          }}
          onTagClick={handleTagClick}
        />
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
        {/* 追加ボタン */}
        <Fab color="primary" aria-label="add" onClick={() => {
          setShowAddForm(true);
          setNewContent("");
          setNewDueDate(new Date());
          setMessage("");
        }}>
          <AddIcon />
        </Fab>
        {/* ホームに戻るボタン */}
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

export default ShowTodoList;