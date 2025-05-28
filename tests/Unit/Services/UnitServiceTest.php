<?php

use App\Enums\Rank;
use App\Models\Employee;
use App\Models\Unit;
use App\Models\User;
use App\Services\Api\UnitService;

covers(UnitService::class);

describe('UnitService', function () {
    it('update unit enable', function () {
        $unit = Unit::factory()->create(['name' => 'test unit']);
        $user = User::factory()->create();
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $data[] = [
            'id' => $unit->id, 'name' => 'new test unit', 'sort' => 1
        ];

        $service = new UnitService();
        $service->update($user, $data);
        $unit->refresh();
        expect($unit->name)->toBe('new test unit');
    });

    it('update unit change ignore', function () {
        $unit = Unit::factory()->create(['name' => 'test unit']);
        $user = User::factory()->create();
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::View]);

        $data[] = [
            'id' => $unit->id, 'name' => 'new test unit', 'sort' => 1
        ];

        $service = new UnitService();
        $service->update($user, $data);
        $unit->refresh();
        expect($unit->name)->toBe('test unit');
    });
});
