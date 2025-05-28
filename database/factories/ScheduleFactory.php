<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Schedule;
use App\Models\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'schedule_date' => fake()->dateTimeBetween('-2 week', '-1 week'),
            'status_id' => Status::factory(),
            'note' => fake()->text(),
        ];
    }
}
