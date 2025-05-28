<?php

use App\Enums\Rank;
use App\Models\Employee;
use App\Models\Schedule;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;

mutates(Employee::class);

describe('Employee Model', function () {
    it('can create a employee', function () {
        $user = User::factory()->create();
        $unit = Unit::factory()->create();

        $employee = Employee::factory()->create(
            [
                'user_id' => $user->id,
                'unit_id' => $unit->id,
                'created_user_id' => $user->id,
            ]
        );

        expect($employee)->toBeInstanceOf(Employee::class)
            ->and($employee->user_id)->toBe($user->id)
            ->and($employee->unit_id)->toBe($unit->id)
            ->and($employee->created_user_id)->toBe($user->id);
    });

    it('belongs to the employee', function () {
        $user = User::factory()->create();
        $unit = Unit::factory()->create();

        $employee = Employee::factory()->create(
            [
                'user_id' => $user->id,
                'unit_id' => $unit->id,
                'created_user_id' => $user->id,
            ]
        );

        expect($employee->user)->toBeInstanceOf(User::class)
            ->and($employee->user->id)->toBe($user->id)
            ->and($employee->unit)->toBeInstanceOf(Unit::class)
            ->and($employee->unit->id)->toBe($unit->id)
            ->and($employee->createUser)->toBeInstanceOf(User::class)
            ->and($employee->createUser->id)->toBe($user->id);
    });

    it('belongs to the schedule', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $employee = Employee::factory()->create();
        $schedule1 = Schedule::factory()->create(['employee_id' => $employee->id]);
        $schedule2 = Schedule::factory()->create(['employee_id' => $employee->id]);

        $this->assertInstanceOf(HasMany::class, $employee->schedules());

        $this->assertCount(2, $employee->schedules);

        $this->assertTrue($employee->schedules->contains($schedule1));
        $this->assertTrue($employee->schedules->contains($schedule2));
    });

    it('has correct fillable attributes', function () {
        $employee = Employee::factory()->create();
        $fillableAttributes = $employee->getFillable();

        expect($fillableAttributes)->toContain('rank')
            ->and($fillableAttributes)->toContain('hidden')
            ->and($fillableAttributes)->toContain('name')
            ->and($fillableAttributes)->toContain('note')
            ->and($fillableAttributes)->toContain('text_color')
            ->and($fillableAttributes)->toContain('bg_color')
            ->and($fillableAttributes)->toContain('sort')
            ->and($fillableAttributes)->toContain('invite')
            ->and($fillableAttributes)->toContain('expired_at');
    });

    it('has a precisely defined cast configuration', function () {
        $reflectionMethod = new ReflectionMethod(Employee::class, 'casts');
        $employee = Employee::factory()->create();
        $casts = $reflectionMethod->invoke($employee);

        expect($casts)->toBe([
            'rank' => Rank::class,
            'expired_at' => 'datetime',
        ]);
    });
});
