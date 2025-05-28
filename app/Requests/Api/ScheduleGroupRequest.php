<?php
declare(strict_types=1);

namespace App\Requests\Api;

use App\Models\Status;
use App\Services\Api\ScheduleGroupDTO;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class ScheduleGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|integer',
            'date' => 'required|required|date_format:Y-m-d',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => __('Field status need to value'),
            'date.required' => __('Field date need to value'),
        ];
    }

    public function withValidator($validator): void
    {
        $unit_id = $this->route('unit');
        $validator->after(function ($validator) use ($unit_id) {
            $data = $validator->getData();
            if (!Status::query()
                ->where('id', $data['status'])
                ->where('unit_id', $unit_id)
                ->exists()) {
                $validator->errors()->add('status', __('Status is wrong for unit '.$unit_id));
            }
        });
    }

    public function getDTO(): ScheduleGroupDTO
    {
        $validated = $this->validated();

        return new ScheduleGroupDTO(
            $validated['status'],
            Carbon::parse($validated['date']),
        );
    }
}
