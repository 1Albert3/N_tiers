<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskRepository
{
    public function getUserTasks(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Task::where('user_id', $userId);

        if (isset($filters['status'])) {
            $query->where('is_completed', $filters['status'] === 'completed');
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function findByIdAndUser(int $id, int $userId): ?Task
    {
        return Task::where('id', $id)->where('user_id', $userId)->first();
    }

    public function update(Task $task, array $data): bool
    {
        return $task->update($data);
    }

    public function delete(Task $task): bool
    {
        return $task->delete();
    }

    public function toggleCompletion(Task $task): bool
    {
        return $task->update(['is_completed' => !$task->is_completed]);
    }
}