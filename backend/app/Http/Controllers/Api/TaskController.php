<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Repositories\TaskRepository;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(private TaskRepository $taskRepository)
    {
        // Middleware défini dans les routes
    }

    public function index(Request $request)
    {
        $filters = $request->only(['status', 'priority', 'search']);
        $perPage = $request->get('per_page', 15);
        
        $tasks = $this->taskRepository->getUserTasks(
            auth()->id(), 
            $filters, 
            min($perPage, 50)
        );

        return response()->json([
            'data' => $tasks->items(),
            'meta' => [
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total()
            ]
        ]);
    }

    public function store(TaskRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $task = $this->taskRepository->create($data);

        return response()->json([
            'message' => 'Tâche créée avec succès',
            'data' => $task
        ], 201);
    }

    public function show(int $id)
    {
        $task = $this->taskRepository->findByIdAndUser($id, auth()->id());

        if (!$task) {
            return response()->json(['message' => 'Tâche non trouvée'], 404);
        }

        return response()->json(['data' => $task]);
    }

    public function update(TaskRequest $request, int $id)
    {
        $task = $this->taskRepository->findByIdAndUser($id, auth()->id());

        if (!$task) {
            return response()->json(['message' => 'Tâche non trouvée'], 404);
        }

        $this->taskRepository->update($task, $request->validated());

        return response()->json([
            'message' => 'Tâche mise à jour avec succès',
            'data' => $task->fresh()
        ]);
    }

    public function destroy(int $id)
    {
        $task = $this->taskRepository->findByIdAndUser($id, auth()->id());

        if (!$task) {
            return response()->json(['message' => 'Tâche non trouvée'], 404);
        }

        $this->taskRepository->delete($task);

        return response()->json(['message' => 'Tâche supprimée avec succès']);
    }

    public function toggle(int $id)
    {
        $task = $this->taskRepository->findByIdAndUser($id, auth()->id());

        if (!$task) {
            return response()->json(['message' => 'Tâche non trouvée'], 404);
        }

        $this->taskRepository->toggleCompletion($task);

        return response()->json([
            'message' => 'Statut de la tâche mis à jour',
            'data' => $task->fresh()
        ]);
    }
}