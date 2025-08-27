// hooks/useTodos.ts
import { useState, useEffect } from "react";
import axios from "axios";
import type { Todo } from '../types';

export const useTodos = (url: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(url);
      setTodos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [url]);

  return { todos, setTodos, loading, fetchTodos };
};
