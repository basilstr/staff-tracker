<?php

use App\Enums\Rank;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\ScheduleController;
use App\Models\Employee;
use App\Models\Schedule;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

mutates(ScheduleController::class);

beforeEach(fn () =>  Cache::store('redis')->flush());

describe('Schedule Controller', function () {
    it('get list schedule', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;

        $employee = Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        $status = Status::factory()->create(['unit_id' => $unit->id]);

        Schedule::factory()->create(['employee_id' => $employee->id, 'schedule_date' => '2020-01-01', 'status_id' => $status->id, 'note'=>'test note']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('schedule.list', ['unit' => $unit->id, 'from' => '2020-01-01', 'to' => '2020-01-02']));

        $response->assertOk()->assertJsonCount(2); // два дні
    });

    it('set group status in schedule', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;

        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        Employee::factory(10)->create(['user_id' => null, 'unit_id' => $unit->id, 'rank' => Rank::View]);
        $status = Status::factory()->create(['unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('schedule.group',
                [
                    'unit' => $unit->id,
                    'from' => '2020-01-01',
                    'to' => '2020-01-01'
                ]),
                [
                'status' => $status->id,
                'date' => '2020-01-01',
            ]);

        $response->assertJsonCount(11, '2020-01-01.schedule');
        $response->assertJsonPath('2020-01-01.unit', $unit->id);
    });

    it('set group wrong status in schedule', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;

        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        Employee::factory(10)->create(['user_id' => null, 'unit_id' => $unit->id, 'rank' => Rank::View]);
        $status = Status::factory()->create(['unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('schedule.group',
                [
                    'unit' => $unit->id,
                    'from' => '2020-01-01',
                    'to' => '2020-01-01'
                ]),
                [
                    'status' => 123123,
                    'date' => '2020-01-01',
                ]);

        $response->assertStatus(422); // Validation failed

        $response->assertJsonValidationErrors(['status']);

        $response->assertJsonFragment([
            'status' => [__('Status is wrong for unit ' . $unit->id)],
        ]);
    });

    it('set employee status in schedule', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;

        $employee = Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        $status = Status::factory()->create(['unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('schedule.employee',
                [
                    'employee' => $employee->id,
                    'from' => '2020-01-01',
                    'to' => '2020-01-01'
                ]),
                [
                'status' => $status->id,
                'from' => '2020-01-01',
                'to' => '2020-01-02',
                'note' => 'test note',
            ]);

        $response->assertJsonCount(1, '2020-01-01.schedule');
        $response->assertJsonPath('2020-01-01.unit', $unit->id);
    });

    it('set employee wrong status in schedule', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;

        $employee = Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        $status = Status::factory()->create(['unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('schedule.employee',
                [
                    'employee' => $employee->id,
                    'from' => '2020-01-01',
                    'to' => '2020-01-01'
                ]),
                [
                    'status' => 123123,
                    'from' => '2020-01-01',
                    'to' => '2020-01-02',
                    'note' => 'test note',
                ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['status']);

        $response->assertJsonFragment([
            'status' => [__('Status is wrong for unit ' . $employee->unit->id)],
        ]);
    });

    it('set employee wrong data in schedule', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;

        $employee = Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        $status = Status::factory()->create(['unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('schedule.employee',
                [
                    'employee' => $employee->id,
                    'from' => '2020-01-01',
                    'to' => '2020-01-01'
                ]),
                [
                    'status' => $status->id,
                    'from' => '2020-01-02',
                    'to' => '2020-01-01',
                    'note' => 'test note',
                ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['status']);

        $response->assertJsonFragment([
            'status' => [__('The "from" date must be earlier than the "to" date')],
        ]);
    });
});

