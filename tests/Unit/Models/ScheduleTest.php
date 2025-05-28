<?php

use App\Models\Employee;
use App\Models\Schedule;
use App\Models\ScheduleLog;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;

mutates(Schedule::class);

beforeEach(function () {
    $user = User::factory()->create();
    $this->actingAs($user);
});

describe('Schedule Model', function () {
    it('can create a schedule', function () {
        $employee = Employee::factory()->create();
        $status = Status::factory()->create();

        $schedule = Schedule::factory()->create(
            [
                'employee_id' => $employee->id,
                'status_id' => $status->id,
            ]
        );

        expect($schedule)->toBeInstanceOf(Schedule::class)
            ->and($schedule->employee_id)->toBe($employee->id)
            ->and($schedule->status_id)->toBe($status->id);
    });

    it('scheduleLogs schedule', function () {
        $schedule = Schedule::factory()->create();

        $scheduleLog1 = ScheduleLog::factory()->create(['schedule_id' => $schedule->id]);
        $scheduleLog2 = ScheduleLog::factory()->create(['schedule_id' => $schedule->id]);

        $this->assertInstanceOf(HasMany::class, $schedule->scheduleLogs());

        $this->assertCount(3, $schedule->scheduleLogs); // із за обзервера 1 - Schedule create + 2 - ScheduleLog create (фабрика)

        $this->assertTrue($schedule->scheduleLogs->contains($scheduleLog1));
        $this->assertTrue($schedule->scheduleLogs->contains($scheduleLog2));
    });

    it('belongs to the employee', function () {
        $employee = Employee::factory()->create();
        $status = Status::factory()->create();

        $schedule = Schedule::factory()->create(
            [
                'employee_id' => $employee->id,
                'status_id' => $status->id,
            ]
        );

        expect($schedule->employee)->toBeInstanceOf(Employee::class)
            ->and($schedule->employee->id)->toBe($employee->id)
            ->and($schedule->status)->toBeInstanceOf(Status::class)
            ->and($schedule->status->id)->toBe($status->id);
    });

});
