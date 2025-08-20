<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\TagController;


// Todo APIエンドポイント
// 送信
Route::post('/api/todo', [TodoController::class, 'setTodo']);
// 取得
Route::get('/api/todo', [TodoController::class, 'index']);
// 削除
Route::delete('api/todo/{id}', [TodoController::class, 'destroy']);
// 更新
Route::put('api/todo/{id}', [TodoController::class, 'update']);

// タグ検索
Route::get('/api/tag/{tag}/todos', [TagController::class, 'getTodosByTag']);


// フロントエンドのすべてのリクエストをキャッチするルート
Route::get('{any}', function () {
    return view('app');
})->where('any','.*');