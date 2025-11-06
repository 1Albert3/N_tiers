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
    try {
        $users = \App\Models\User::count();
        $tasks = \App\Models\Task::count();
        
        $metrics = [
            "# HELP app_status Application status",
            "# TYPE app_status gauge",
            "app_status 1",
            "# HELP app_uptime Application uptime",
            "# TYPE app_uptime counter",
            "app_uptime " . time(),
            "# HELP app_total_users Total number of users",
            "# TYPE app_total_users gauge",
            "app_total_users $users",
            "# HELP app_total_tasks Total number of tasks",
            "# TYPE app_total_tasks gauge",
            "app_total_tasks $tasks"
        ];
    } catch (\Exception $e) {
        $metrics = [
            "# HELP app_status Application status",
            "# TYPE app_status gauge",
            "app_status 1",
            "# HELP app_uptime Application uptime",
            "# TYPE app_uptime counter",
            "app_uptime " . time()
        ];
    }
    
    return response(implode("\n", $metrics), 200)
        ->header('Content-Type', 'text/plain');
});