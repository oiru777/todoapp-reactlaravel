<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Mail;


// Todo APIエンドポイント
// 送信
Route::post('/api/todo', [TodoController::class, 'setTodo'])
    ->middleware(['auth', 'verified']);
// 取得
Route::get('/api/todo', [TodoController::class, 'index'])
    ->middleware(['auth', 'verified']);
// 削除
Route::delete('api/todo/{id}', [TodoController::class, 'destroy'])
    ->middleware(['auth', 'verified']);
// 更新
Route::put('api/todo/{id}', [TodoController::class, 'update'])
    ->middleware(['auth', 'verified']);

// タグ検索
Route::get('/api/tag/{tag}/todos', [TagController::class, 'getTodosByTag'])
    ->middleware(['auth', 'verified']);

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect(env('FRONTEND_URL') . '/verified');
})->middleware(['signed'])->name('verification.verify');

// フロントエンドのすべてのリクエストをキャッチするルート
Route::get('{any}', function () {
    return view('app');
})->where('any','.*');
