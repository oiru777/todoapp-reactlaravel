export interface Tag {
  id: number;
  name: string;
}

export interface Todo {
  id: number;
  content: string;
  due_date: string; // ISO形式の日付（例：2025-09-01）
  tags?: Tag[];
  done: boolean;
}
