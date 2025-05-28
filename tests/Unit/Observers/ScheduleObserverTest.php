<?php

use App\Enums\Rank;
use App\Models\Employee;
use App\Models\Schedule;
use App\Models\ScheduleLog;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use App\Observers\ScheduleObserver;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Hash;

mutates(ScheduleObserver::class);

describe('ScheduleObserver', function () {
    it('check Schedule Observer', function () {
        // Створюємо користувача
        $user = User::factory()->create();
        $this->actingAs($user);

        $unit = Unit::factory()->create();
        $status1 = Status::factory()->create(['unit_id' => $unit->id]);
        $status2 = Status::factory()->create(['unit_id' => $unit->id]);

        $employee = Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $schedule = Schedule::factory()->create([
            'employee_id' => $employee->id,
            'schedule_date' => '2020-01-01',
            'status_id' => $status1->id,
            'note' => 'Initial Note'
        ]);

        $schedule->update([
            'status_id' => $status2->id,
            'note' => 'Updated Note'
        ]);

        $this->assertDatabaseHas('schedule_logs', [
            'schedule_id' => $schedule->id,
            'user_id' => $user->id,
            'status_id' => $status1->id, // старе значення статусу
            'note' => 'Initial Note', // стара нотатка
        ]);
    });
});
