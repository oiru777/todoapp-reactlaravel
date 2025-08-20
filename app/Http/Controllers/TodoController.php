<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todo;

class TodoController extends Controller
{
    // 新しいTodoを追加するメソッド
    public function setTodo(Request $request)
    {
        // リクエストのバリデーション: 'content' フィールドが必須であり、文字列で、最大255文字までであることを検証
        $request->validate([
            'content' => 'required|string|max:255',
            'due_date' => 'required|date',
            'tags' => 'array',
            'tags.*' => 'string', 
        ]);

        // Todoを作成してデータベースに保存
        $todo = Todo::create([
            'content' => $request->content,
            'due_date' => $request->due_date,
        ]);
        // タグを保存（中間テーブル経由）
        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = \App\Models\Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            $todo->tags()->sync($tagIds);
        }

        // 作成したTodoをJSON形式で返す
        return response()->json($todo, 201); // ステータスコード201で返す
    }

    // 全てのTodoを取得して返すメソッド
    public function index()
    {
        // Todoのすべてのレコードを取得して変数に格納
        $todos = Todo::all();

        // 取得したTodoのリストをJSON形式で返す
        return response()->json($todos);
    }
    // Todoを削除するメソッド
    public function destroy($id)
    {
        $todo = Todo::find($id);

        if ($todo) {
        $todo->delete();
        return response()->json(['message' => 'Deleted successfully']);
        } else {
            return response()->json(['error' => 'Todo not found'], 404);
        }
    }

    // Todoを更新するメソッド
    public function update(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);
        $todo->content = $request->input('content');
        $todo->due_date = $request->input('due_date');
        $todo->save();

        return response()->json($todo);
    }


}