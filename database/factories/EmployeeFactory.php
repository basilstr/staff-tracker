<?php

namespace Database\Factories;

use App\Enums\Rank;
use App\Models\Employee;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'unit_id' => Unit::factory(),
            'rank' => Arr::random(Rank::cases()),
            'name' => fake()->name(),
            'note' => fake()->text(),
            'text_color' => fake()->safeHexColor(),
            'bg_color' => fake()->safeHexColor(),
            'sort' => fake()->numberBetween(1,100),
            'invite' => Hash::make('invite'. fake()->randomAscii()),
            'expired_at' => fake()->dateTimeBetween('+1 week', '+1 year'),
            'created_user_id' => User::factory(),
        ];
    }
}
