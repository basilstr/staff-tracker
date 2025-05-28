<?php

namespace App\Requests\Api;

use App\Services\Api\UserDTO;
use App\Services\Api\UserUpdateDTO;
use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'password' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Field "name" is required.',

            'name.email' => 'Field "name" is not a valid email.',
            'password.string' => 'Field "password" must be a string.',
        ];
    }


    public function getDTO(): UserUpdateDTO
    {
        $validated = $this->validated();

        return new UserUpdateDTO(
            $validated['name'],
            $validated['password'] ?? ''
        );
    }
}
