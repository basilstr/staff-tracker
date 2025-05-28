<?php
declare(strict_types=1);

namespace App\Requests\Api;

use App\Services\Api\UserDTO;
use Illuminate\Foundation\Http\FormRequest;

class StatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            '*.id' => 'required|integer',
            '*.sort' => 'required|integer|min:0|max:100',
            '*.name' => 'required|string|max:255',
            '*.short_name' => 'required|string|max:5',
            '*.is_group' => 'required|boolean',
            '*.text_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            '*.bg_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }
}
