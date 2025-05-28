<?php
declare(strict_types=1);

namespace App\Requests\Api;

use App\Enums\Rank;
use App\Services\Api\EmployeeDTO;
use App\Services\Api\UserDTO;
use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|integer',
            'rank' => 'required|integer',
            'name' => 'required|string|max:255',
            'note' => 'nullable|string|max:255',
            'text_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'bg_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sort' => 'required|integer|min:0|max:100',
            'hidden' => 'nullable|in:0,1',
        ];
    }

    public function getDTO(): EmployeeDTO
    {
        $validated = $this->validated();

        return new EmployeeDTO(
            $validated['id'],
            Rank::from($validated['rank']),
            $validated['name'],
            $validated['note'] ?? '',
            $validated['text_color'],
            $validated['bg_color'],
            $validated['sort'],
            $validated['hidden'] ?? 0,
        );
    }
}
