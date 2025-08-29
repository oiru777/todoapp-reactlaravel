<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\LoginController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::middleware(['api'])->prefix('/v1.0')->group(function () {
    Route::post('/login',[LoginController::class, 'login']);
    Route::post('/logout',[LoginController::class, 'logout']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/test',[AccountController::class, 'test']);
    });
});
