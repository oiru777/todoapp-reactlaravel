<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todo;

class TodoController extends Controller
{
    // 新しいTodoを追加するメソッド
    public function setTodo(Request $request)
    {
        $validated = $request->validate([
        'content' => 'required|string|max:255',
        'due_date' => 'required|date',
        'tags' => 'array',
        'tags.*' => 'string|max:50', 
    ]);

    $todo = Todo::create([
        'content' => $validated['content'],
        'due_date' => $validated['due_date'],
    ]);

    if (!empty($validated['tags'])) {
        $tagIds = [];
        foreach ($validated['tags'] as $tagName) {
            $tag = \App\Models\Tag::firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }
        $todo->tags()->sync($tagIds);
    }

    }

    // 全てのTodoを取得して返すメソッド
    public function index()
    {
        // Todoのすべてのレコードを取得して変数に格納
        $todos = Todo::with('tags')->get();

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
    $validated = $request->validate([
        'content' => 'required|string|max:255',
        'due_date' => 'required|date',
        'tags' => 'array',
        'tags.*' => 'string|max:50', 
        'done' => 'nullable|boolean',
    ]);

    $todo = Todo::findOrFail($id);
    $todo->content = $validated['content'];
    $todo->due_date = $validated['due_date'];
    if ($request->has('done')) {
        $todo->done = $request->input('done');
    }
    $todo->save();

    if (isset($validated['tags'])) {
        $tagIds = [];
        foreach ($validated['tags'] as $tagName) {
            $tag = \App\Models\Tag::firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }
        $todo->tags()->sync($tagIds);
    }

    return response()->json($todo->load('tags')); 
}



}