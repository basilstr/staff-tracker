<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\ScheduleLog;
use App\Models\Status;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ScheduleLog>
 */
class ScheduleLogFactory extends Factory
{
    protected $model = ScheduleLog::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'schedule_id' => Schedule::factory(),
            'user_id' => User::factory(),
            'status_id' => Status::factory(),
            'note' => fake()->text(),
        ];
    }
}
