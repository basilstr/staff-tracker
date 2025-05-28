<?php
declare(strict_types=1);

namespace App\Requests\Api;

use App\Services\Api\JoinDTO;
use Illuminate\Foundation\Http\FormRequest;

class JoinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invite' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'invite.required' => 'Field "invite" is required.',
            'invite.string' => 'Field "invite" must be a string.',
        ];
    }


    public function getDTO(): JoinDTO
    {
        $validated = $this->validated();

        return new JoinDTO(
            $validated['invite'],
        );
    }
}
