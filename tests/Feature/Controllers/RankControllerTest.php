<?php

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RankController;
use App\Models\Employee;
use App\Models\Unit;
use App\Models\User;

mutates(RankController::class);

describe('Rank Controller', function () {
    it('returns ranks', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;

        $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $userToken,
            ])
            ->getJson(route('ranks.index'));

        $response->assertOk()
            ->assertJsonCount(6)
            ->assertJsonStructure([
                '*' => ['id', 'name'],
            ]);
    });
});
