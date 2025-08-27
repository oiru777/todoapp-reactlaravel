<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    // タグ名から関連するTodoを取得して返す
    public function getTodosByTag($tagName)
{
    $tag = Tag::where('name', $tagName)->first();

    if (!$tag) {
        return response()->json([]);
    }

    return response()->json(
        $tag->todos()->with('tags')->get()
    );
}

}
