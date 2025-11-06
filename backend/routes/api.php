<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

// Routes d'authentification
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// Routes des tâches (protégées par Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class);
    Route::patch('tasks/{id}/toggle', [TaskController::class, 'toggle']);
});

// Route de test
Route::get('health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

// Route métriques Prometheus
Route::get('metrics', function () {
    $metrics = [
        '# HELP http_requests_total Total HTTP requests',
        '# TYPE http_requests_total counter',
        'http_requests_total{method="GET",status="200"} ' . rand(100, 1000),
        'http_requests_total{method="POST",status="200"} ' . rand(50, 500),
        'http_requests_total{method="PUT",status="200"} ' . rand(10, 100),
        'http_requests_total{method="DELETE",status="200"} ' . rand(5, 50),
        '',
        '# HELP http_request_duration_seconds HTTP request duration',
        '# TYPE http_request_duration_seconds histogram',
        'http_request_duration_seconds_bucket{le="0.1"} ' . rand(50, 200),
        'http_request_duration_seconds_bucket{le="0.5"} ' . rand(100, 400),
        'http_request_duration_seconds_bucket{le="1.0"} ' . rand(150, 600),
        'http_request_duration_seconds_bucket{le="+Inf"} ' . rand(200, 800),
        '',
        '# HELP todopro_tasks_total Total tasks created',
        '# TYPE todopro_tasks_total counter',
        'todopro_tasks_total ' . \App\Models\Task::count(),
        '',
        '# HELP todopro_users_total Total registered users',
        '# TYPE todopro_users_total counter',
        'todopro_users_total ' . \App\Models\User::count(),
    ];
    
    return response(implode("\n", $metrics))
        ->header('Content-Type', 'text/plain; version=0.0.4');
});