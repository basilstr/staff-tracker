<?php

use App\Models\Employee;
use App\Models\Schedule;
use App\Models\ScheduleLog;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;

mutates(ScheduleLog::class);

describe('ScheduleLog Model', function () {
    it('can create a ScheduleLog', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $schedule = Schedule::factory()->create();
        $user = User::factory()->create();
        $status = Status::factory()->create();

        $scheduleLog = ScheduleLog::factory()->create(
            [
                'schedule_id' => $schedule->id,
                'user_id' => $user->id,
                'status_id' => $status->id,
            ]
        );

        expect($scheduleLog)->toBeInstanceOf(ScheduleLog::class)
            ->and($scheduleLog->schedule)->toBeInstanceOf(Schedule::class)
            ->and($scheduleLog->schedule_id)->toBe($schedule->id)
            ->and($scheduleLog->user)->toBeInstanceOf(User::class)
            ->and($scheduleLog->user_id)->toBe($user->id)
            ->and($scheduleLog->status)->toBeInstanceOf(Status::class)
            ->and($scheduleLog->status_id)->toBe($status->id);
    });
});
