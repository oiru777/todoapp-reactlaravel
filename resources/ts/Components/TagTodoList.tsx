import React from "react";
import TodoListPage from "./TodoListPage";
import { useParams } from "react-router-dom";

const TagTodoList: React.FC = () => {
  const { tagName } = useParams();
  return <TodoListPage title={`タグ: ${tagName}`} fetchUrl={`/api/tag/${tagName}/todos`} initialTag={tagName ?? ""}/>;
};

export default TagTodoList;
