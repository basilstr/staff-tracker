<?php

use App\Enums\Rank;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RankController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\UnitController;
use App\Models\Employee;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;

mutates(UnitController::class);

describe('Unit Controller', function () {
    it('returns status', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $userToken,
            ])
            ->getJson(route('units.index'));

        $response->assertOk()->assertJsonCount(1);
    });

    it('modifies statuses', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $data = [[
            "id" => 0,
            "sort" => 3,
            "name" => "Katarina Denesik",
        ]];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('units.update'), $data);

        $response->assertOk()->assertJsonCount(1);
    });
});
