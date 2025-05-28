<?php

use App\Enums\Rank;
use App\Http\Controllers\Api\ReportController;
use App\Models\Employee;
use App\Models\Schedule;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

mutates(ReportController::class);

beforeEach(fn () =>  Cache::store('redis')->flush());

describe('Report Controller', function () {
    it('get list report', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;

        $employee = Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        $status = Status::factory()->create(['unit_id' => $unit->id]);

        // п'ятниця субота неділя
        Schedule::factory()->create(['employee_id' => $employee->id, 'schedule_date' => '2020-01-03', 'status_id' => $status->id, 'note'=>'test note']);
        Schedule::factory()->create(['employee_id' => $employee->id, 'schedule_date' => '2020-01-04', 'status_id' => $status->id, 'note'=>'test note']);
        Schedule::factory()->create(['employee_id' => $employee->id, 'schedule_date' => '2020-01-05', 'status_id' => $status->id, 'note'=>'test note']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('report.statuses', ['unit' => $unit->id, 'from' => '2020-01-03', 'to' => '2020-01-05']));

        $response->assertOk()
            ->assertJsonCount(4)
            ->assertJsonFragment([
                'unit' => $unit->id,
                'date_from' => '2020-01-03',
                'date_to' => '2020-01-05',
            ])
            ->assertJsonPath("report.{$employee->id}.{$status->id}", [1, 1, 1]);
    });

    it(' wrong unit', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('report.statuses', ['unit' => 0, 'from' => '2020-01-01', 'to' => '2020-01-02']));

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Unit not found',
            ]);
    });
});

