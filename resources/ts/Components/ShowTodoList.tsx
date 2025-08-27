import React from "react";
import TodoListPage from "./TodoListPage";

const ShowTodoList: React.FC = () => {
  return <TodoListPage title="ToDoリスト" fetchUrl="/api/todo" />;
};

export default ShowTodoList;
