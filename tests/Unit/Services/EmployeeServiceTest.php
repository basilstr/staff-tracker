<?php

use App\Enums\Rank;
use App\Models\Employee;
use App\Models\Unit;
use App\Models\User;
use App\Services\Api\EmployeeDTO;
use App\Services\Api\EmployeeService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

covers(EmployeeService::class);

describe('EmployeeService', function () {
    it('updates an employee when the employee exists - rank - owner', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $employee = Employee::factory()->create(['user_id' => $user->id, 'unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $employeeDTO = new EmployeeDTO(
            $employee->id,
            Rank::Owner,
            'Updated name',
            'Updated note',
            '#FFFFFF',
            '#000000',
            1,
            0,
        );

        $employeeService = new EmployeeService();
        $updatedEmployee = $employeeService->update($employee, $user, $employeeDTO);

        // Перевірка: чи дані оновлені в моделі співробітника
        expect($updatedEmployee->name)->toBe('Updated name')
            ->and($updatedEmployee->note)->toBe('Updated note')
            ->and($updatedEmployee->text_color)->toBe('#FFFFFF')
            ->and($updatedEmployee->bg_color)->toBe('#000000')
            ->and($updatedEmployee->sort)->toBe(1)
            ->and($updatedEmployee->rank)->toBe(Rank::Owner)
            ->and($updatedEmployee->hidden)->toBe(0);
    });

    it('updates an employee when rank do not update rank - Owner', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        Employee::factory()->create(['unit_id' => $unit->id, 'user_id' => $user->id, 'rank' => Rank::Owner]); // owner group
        $employee = Employee::factory()->create(['unit_id' => $unit->id, 'rank' => Rank::Forbidden]);

        $employeeDTO = new EmployeeDTO(
            $employee->id,
            Rank::Owner,
            'Updated name',
            'Updated note',
            '#FFFFFF',
            '#000000',
            1,
            0,
        );

        $employeeService = new EmployeeService();
        $updatedEmployee = $employeeService->update($employee, $user, $employeeDTO);

        // Перевірка: чи дані оновлені в моделі співробітника
        expect($updatedEmployee->name)->toBe('Updated name')
            ->and($updatedEmployee->note)->toBe('Updated note')
            ->and($updatedEmployee->text_color)->toBe('#FFFFFF')
            ->and($updatedEmployee->bg_color)->toBe('#000000')
            ->and($updatedEmployee->sort)->toBe(1)
            ->and($updatedEmployee->rank)->toBe(Rank::Owner)
            ->and($updatedEmployee->hidden)->toBe(0);
    });

    it('updates an employee ModelNotFoundException', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        $employee = Employee::factory()->create(['unit_id' => $unit->id, 'rank' => Rank::Owner]);

        $employeeDTO = new EmployeeDTO(
            $employee->id,
            Rank::View,
            'Updated name',
            'Updated note',
            '#FFFFFF',
            '#000000',
            1,
            0,
        );

        $employeeService = new EmployeeService();
        expect(fn () => $employeeService->update($employee, $user, $employeeDTO))
            ->toThrow(ModelNotFoundException::class, 'Employee not found.');
    });

    it('check generate invite', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        Employee::factory()->create(['unit_id' => $unit->id, 'user_id' => $user->id, 'rank' => Rank::Owner]); // owner group
        $employee = Employee::factory()->create(['user_id' => null, 'unit_id' => $unit->id, 'invite' => null, 'expired_at'=> null]);

        $employeeService = new EmployeeService();
        $invite = $employeeService->invite($employee, $user);
        expect($invite)->not()->toBeEmpty($invite['invite'])
            ->not()->toBeEmpty($invite['expired_at']);
    });

    it('check store', function () {
        $unit = Unit::factory()->create();
        $user = User::factory()->create();
        Employee::factory()->create(['unit_id' => $unit->id, 'user_id' => $user->id, 'rank' => Rank::Owner]);
        $employeeDTO = new EmployeeDTO(
            0,
            Rank::Forbidden,
            'store name',
            'store note',
            '#FFFFFF',
            '#000000',
            1,
            0,
        );
        $employeeService = new EmployeeService();
        $employee = $employeeService->store($unit, $user, $employeeDTO);
        expect($employee->user_id)->toBe(null)
            ->and($employee->created_user_id)->toBe($user->id)
            ->and($employee->unit_id)->toBe($unit->id)
            ->and($employee->rank)->toBe(Rank::Forbidden)
            ->and($employee->name)->toBe('store name')
            ->and($employee->note)->toBe('store note')
            ->and($employee->hidden)->toBe(0);
    });

    it('updates employee successfully', function () {
        $user = User::factory()->create();
        $unit = Unit::factory()->create();
        $employee = Employee::factory()->create(['unit_id' => $unit->id]);
        $myEmployee = Employee::factory()->create([
            'user_id' => $user->id,
            'unit_id' => $employee->unit_id,
            'rank' => Rank::Forbidden,
        ]);

        $employeeDTO = new EmployeeDTO(
            $employee->id,
            Rank::View,
            'Updated name',
            'Updated note',
            '#FFFFFF',
            '#000000',
            1,
            0,
        );

        $service = new EmployeeService();
        $updatedEmployee = $service->update($employee, $user, $employeeDTO);

        expect($updatedEmployee->name)->toBe($employeeDTO->name)
            ->and($updatedEmployee->note)->toBe($employeeDTO->note)
            ->and($updatedEmployee->text_color)->toBe($employeeDTO->textColor)
            ->and($updatedEmployee->bg_color)->toBe($employeeDTO->bgColor)
            ->and($updatedEmployee->sort)->toBe($employeeDTO->sort)
            ->and($updatedEmployee->hidden)->toBe($employeeDTO->hidden)
            ->and($updatedEmployee->rank)->toBe(
                $myEmployee->rank->value >= $employeeDTO->rank ? Rank::from($employeeDTO->rank) : $myEmployee->rank
            );
    });

    it('throws exception when employee not found', function () {
        $user = User::factory()->create();
        $unit = Unit::factory()->create();
        $employee = Employee::factory()->create(['unit_id' => $unit->id]);
        $employeeDTO = new EmployeeDTO(
            $employee->id,
            Rank::View,
            'Updated name',
            'Updated note',
            '#FFFFFF',
            '#000000',
            1,
            0,
        );

        $service = new EmployeeService();
        $this->expectException(ModelNotFoundException::class);
        $service->update($employee, $user, $employeeDTO);
    });

    it('throws exception when Create invite is forbidden', function () {
        $user = User::factory()->create();
        $employee = Employee::factory()->create(['user_id' => $user->id]);

        $service = new EmployeeService();
        $this->expectException(Exception::class);
        $service->invite($employee, $user);
    });
});
