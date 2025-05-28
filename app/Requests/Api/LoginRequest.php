<?php
declare(strict_types=1);

namespace App\Requests\Api;

use App\Services\Api\UserDTO;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'nullable|email|required_without:google_token',
            'password' => 'nullable|string|required_without:google_token',
            'google_token' => 'nullable|string|required_without:email,password',
            'invite' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required_without' => 'Field "email" is required when "google_token" is not provided.',
            'password.required_without' => 'Field "password" is required when "google_token" is not provided.',
            'google_token.required_without' => 'Field "google_token" is required when neither "email" nor "password" are provided.',

            'email.email' => 'Field "email" is not a valid email.',
            'password.string' => 'Field "password" must be a string.',
            'google_token.string' => 'Field "google_token" must be a string.',
            'invite.string' => 'Field "google_token" must be a string.',
        ];
    }


    public function getDTO(): UserDTO
    {
        $validated = $this->validated();

        return new UserDTO(
            $validated['email'] ?? '',
            $validated['password'] ?? '',
            $validated['google_token'] ?? '',
            $validated['invite'] ?? '',
        );
    }
}
