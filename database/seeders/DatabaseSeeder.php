<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Schedule;
use App\Models\ScheduleLog;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);



        $unit = Unit::factory()->create([
            'name' => 'Unit 1',
        ]);

        Status::factory(10)->create(['unit_id' => $unit->id]);

        Employee::factory(10)->create([
            'user_id' => $user->id,
            'unit_id' => $unit->id,
            'created_user_id' => $user->id,
        ]);
    }
}
