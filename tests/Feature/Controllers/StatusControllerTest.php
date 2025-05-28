<?php

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RankController;
use App\Http\Controllers\Api\StatusController;
use App\Models\Employee;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;

mutates(StatusController::class);

describe('Status Controller', function () {
    it('returns status', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;

        $unit = Unit::factory()->create();
        Status::factory(3)->create(['unit_id' => $unit->id]);

        $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $userToken,
            ])
            ->getJson(route('statuses.index', ['unit' => $unit->id]));

        $response->assertOk()->assertJsonCount(3);
    });

    it('modifies statuses', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;

        $unit = Unit::factory()->create();
        Status::factory(3)->create(['unit_id' => $unit->id]);

        // One is added, and the others are marked as deleted, but they are still included in the response — so, 4, not 1.
        $data = [[
            "id" => 0,
            "sort" => 3,
            "name" => "Katarina Denesik",
            "short_name" => "lqo",
            "is_group" => false,
            "text_color" => "#00eecc",
            "bg_color" => "#0000aa",
        ]];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('statuses.update', ['unit' => $unit->id]), $data);
        $deletedCount = collect($response->json())->whereNotNull('deleted_at')->count();

        $response->assertOk()->assertJsonCount(4);
        $this->assertEquals(3, $deletedCount);
    });
});
