<?php

namespace Database\Factories;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Status>
 */
class StatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'unit_id' => Unit::factory(),
            'sort' => fake()->numberBetween(1,100),
            'name' => fake()->name(),
            'short_name' => fake()->lexify('???'),
            'is_group' => fake()->boolean(),
            'text_color' => fake()->safeHexColor(),
            'bg_color' => fake()->safeHexColor(),
        ];
    }
}
