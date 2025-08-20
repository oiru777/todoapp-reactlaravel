<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;


// Todo APIエンドポイント
// 送信
Route::post('/api/todo', [TodoController::class, 'setTodo']);
// 取得
Route::get('/api/todo', [TodoController::class, 'index']);
// 削除
Route::delete('api/todo/{id}', [TodoController::class, 'destroy']);
// 更新
Route::put('api/todo/{id}', [TodoController::class, 'update']);


// フロントエンドのすべてのリクエストをキャッチするルート
Route::get('{any}', function () {
    return view('app');
})->where('any','.*');