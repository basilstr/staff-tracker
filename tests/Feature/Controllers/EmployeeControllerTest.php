<?php

use App\Enums\Rank;
use App\Http\Controllers\Api\EmployeeController;
use App\Models\Employee;
use App\Models\Unit;
use App\Models\User;

mutates(EmployeeController::class);

describe('Employee Controller', function () {
    it('creates a new employee with wrong access', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;

        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::View]);

        $data = [
            'id' => 0,
            'name' => 'Updated Name',
            'rank' => Rank::Forbidden->value,
            'text_color' => '#ffffff',
            'bg_color' => '#000000',
            'sort' => 10,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('employee.store', $unit->id), $data);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Addition forbidden.',
            ]);
    });

    it('returns employees of a unit', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;
        $unit = Unit::factory()->create(['id' => 111]);
        Employee::factory()->count(3)->create(['unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('employee.index', 111));

        $response->assertOk()->assertJsonCount(3);
    });

    it('returns employees of a wrong unit', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;
        $unit = Unit::factory()->create(['id' => 111]);
        Employee::factory()->count(3)->create(['unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('employee.index', 222));

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Unit not found',
            ]);
    });

    it('creates a new employee', function () {
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        $unit = Unit::factory()->create();
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $data = [
            'id' => 0,
            'name' => 'Updated Name',
            'rank' => Rank::Forbidden->value,
            'note' => 'Test note',
            'text_color' => '#FFFFFF',
            'bg_color' => '#000000',
            'sort' => 10,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('employee.store', $unit->id), $data);

        $response->assertCreated()
            ->assertJsonStructure(['id', 'user_id', 'unit_id', 'rank', 'name', 'note', 'text_color', 'bg_color', 'sort'])
            ->assertJson([
                'name' => 'Updated Name',
                'rank' => Rank::Forbidden->value,
                'note' => 'Test note',
                'text_color' => '#FFFFFF',
                'bg_color' => '#000000',
                'sort' => 10,
            ]);
    });

    it('creates a new employee with wrong unit', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;
        $data = [
            'id' => 0,
            'name' => 'Updated Name',
            'rank' => Rank::Forbidden->value,
            'text_color' => '#ffffff',
            'bg_color' => '#000000',
            'sort' => 10,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->postJson(route('employee.store', 0), $data);

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Unit not found',
            ]);
    });

    it('returns an employee', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;
        $employee = Employee::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('employee.show', $employee->id));

        $response->assertOk()->assertJson(
            [
                'id' => $employee->id,
                'rank' => $employee->rank->value,
                'name' => $employee->name,
                'note' => $employee->note,
                'text_color' => $employee->text_color,
                'bg_color' => $employee->bg_color,
                'sort' => $employee->sort,
            ]
        );
    });

    it('returns an wrong employee', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;
        $employee = Employee::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('employee.show', $employee->id + 1));

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Employee not found',
            ]);
    });

    it('returns an invite resource', function () {
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        $unit = Unit::factory()->create();
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        $employee = Employee::factory()->create(['user_id' => null, 'unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('employee.invite', $employee->id));
        $employee->refresh();
        $response->assertOk()->assertJson([
            'invite' => $employee->invite,
            'expired_at' => $employee->expired_at->format('Y-m-d H:i:s'),
        ]);
    });

    it('returns an invite resource an wrong employee', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;
        $employee = Employee::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('employee.invite', 0));
        $employee->refresh();

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Employee not found',
            ]);
    });

    it('returns an invite with wrong access', function () {
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        $unit = Unit::factory()->create();
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::View]);
        $employee = Employee::factory()->create(['user_id' => null, 'unit_id' => $unit->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->getJson(route('employee.invite', $employee->id));

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Create invite is forbidden.',
            ]);
    });

    it('modifies an employee', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $employee = Employee::factory()->create(['unit_id' => $unit->id]);
        $data = [
            'id' => $employee->id,
            'name' => 'Updated Name',
            'rank' => Rank::Forbidden->value,
            'text_color' => '#ffffff',
            'bg_color' => '#000000',
            'sort' => 10,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->putJson(route('employee.update', $employee->id), $data);

        $response->assertOk()->assertJson([
            'id' => $employee->id,
            'name' => 'Updated Name',
            'text_color' => '#ffffff',
            'bg_color' => '#000000',
            'sort' => 10,
        ]);
    });

    it('modifies an wrong employee', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $employee = Employee::factory()->create(['unit_id' => $unit->id]);
        $data = [
            'id' => $employee->id,
            'name' => 'Updated Name',
            'rank' => Rank::Forbidden->value,
            'text_color' => '#ffffff',
            'bg_color' => '#000000',
            'sort' => 10,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->putJson(route('employee.update', 0), $data);

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Employee not found',
            ]);
    });

    it('delete an employee', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $userTwo = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);
        $employee = Employee::factory()->create(['user_id' => $userTwo->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->deleteJson(route('employee.destroy', $employee->id));

        $response->assertOk()->assertJson(['message' => 'Employee deleted']);
    });

    it('delete an  wrong employee', function () {
        $userToken = User::factory()->create()->createToken('test@example.com')->plainTextToken;
        $employee = Employee::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->deleteJson(route('employee.destroy', $employee->id + 1));

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Employee not found',
            ]);
    });

    it('delete an employee with wrong access', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $userTwo = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::View]);
        $employee = Employee::factory()->create(['user_id' => $userTwo->id, 'unit_id' => $unit->id, 'rank' => Rank::View]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->deleteJson(route('employee.destroy', $employee->id));

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Deletion forbidden.',
            ]);
    });

    it('forbidden delf deleted', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $this->actingAs($user);
        $userToken = $user->createToken('test@example.com')->plainTextToken;
        $employee =Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::View]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $userToken,
        ])
            ->deleteJson(route('employee.destroy', $employee->id));

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Self-deletion is forbidden.',
            ]);
    });
});
