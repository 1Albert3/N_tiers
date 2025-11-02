<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'priority' => 'nullable|in:low,medium,high',
            'due_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères',
            'description.max' => 'La description ne peut pas dépasser 1000 caractères',
            'priority.in' => 'La priorité doit être: low, medium ou high',
            'due_date.date' => 'La date d\'échéance doit être une date valide',
            'due_date.after' => 'La date d\'échéance doit être dans le futur',
        ];
    }
}