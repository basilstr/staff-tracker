<?php
declare(strict_types=1);

namespace App\Requests\Api;

use App\Models\Employee;
use App\Models\Status;
use App\Services\Api\ScheduleEmployeeDTO;
use App\Services\Api\ScheduleGroupDTO;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class ScheduleEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|integer',
            'from' => 'required|required|date_format:Y-m-d',
            'to' => 'required|required|date_format:Y-m-d',
            'note' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => __('Field status need to value'),
            'from.required' => __('Field date need to value'),
            'to.required' => __('Field date need to value'),

            'status.integer' => __('The date must be in the correct integer format'),
            'from.date_format' => __('The date must be in the correct format (Y-m-d)'),
            'to.date_format' => __('The date must be in the correct format (Y-m-d)'),

            'note.string' => __('The note must be a string'),
            'note.max' => __('The note may not be greater than 255 characters'),
        ];
    }

    public function withValidator($validator): void
    {
        $employee_id = $this->route('employee');
        $validator->after(function ($validator) use ($employee_id) {
            $data = $validator->getData();
            $employee = Employee::find($employee_id);
            if ($employee && !Status::query()
                    ->where('id', $data['status'])
                    ->where('unit_id', $employee->unit_id)
                    ->exists()) {
                $validator->errors()->add('status', __('Status is wrong for unit ' . $employee->unit->id));
            }
            if (Carbon::parse($data['from'])->startOfDay() > Carbon::parse($data['to'])->startOfDay()) {
                $validator->errors()->add('status', __('The "from" date must be earlier than the "to" date'));
            }
        });
    }

    public function getDTO(): ScheduleEmployeeDTO
    {
        $validated = $this->validated();

        return new ScheduleEmployeeDTO(
            $validated['status'],
            Carbon::parse($validated['from']),
            Carbon::parse($validated['to']),
            $validated['note'] ?? '',
        );
    }
}
