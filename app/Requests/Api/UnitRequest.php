<?php

namespace App\Requests\Api;

use App\Services\Api\UserDTO;
use Illuminate\Foundation\Http\FormRequest;

class UnitRequest extends FormRequest
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
        ];
    }
}
