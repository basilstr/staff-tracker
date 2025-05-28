<?php
declare(strict_types=1);

namespace App\Services\Api;

use App\Enums\Rank;
use App\Models\Employee;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EmployeeService
{
    const TTL_INVITE_MINUTES = 5;
    const PASSWORD_LENGTH = 16;

    public function findUnit($id)
    {
        return Unit::find($id);
    }
    public function findEmployee($id)
    {
        return Employee::find($id);
    }
    public function list(Unit $unit): Collection
    {
        $cacheKey = sprintf('employee-unit-%s', $unit->id);
        return Cache::store('redis')->tags(['unit_'.$unit->id])->remember($cacheKey, config('cache.cache_ttl'), function () use ($unit) {
            return Employee::where('unit_id', $unit->id)->get();
        });
    }

    /**
     * @throws \Exception
     */
    public function store(Unit $unit, User $user, EmployeeDTO $employeeDTO): Employee
    {
        // who update information
        $myEmployee = Employee::query()->where('user_id', $user->id)->where('unit_id', $unit->id)->first();

        if ($myEmployee) {
            if ($myEmployee->rank->isNotLowerThan(Rank::Admin)) {
                Cache::store('redis')->tags('unit_'.$unit->id)->flush();
                return  Employee::create(
                    [
                        'user_id' => null,
                        'created_user_id' => $user->id,
                        'unit_id' => $unit->id,
                        'rank' => $employeeDTO->rank,
                        'name' => $employeeDTO->name,
                        'note' => $employeeDTO->note,
                        'text_color' => $employeeDTO->textColor,
                        'bg_color' => $employeeDTO->bgColor,
                        'sort' => $employeeDTO->sort,
                        'hidden' => $employeeDTO->hidden,
                    ]
                );
            }
        }
        throw new \Exception('Addition forbidden.');
    }
    public function update(Employee $employee, User $user, EmployeeDTO $employeeDTO): Employee
    {
        // who update information
        $myEmployee = Employee::query()->where('user_id', $user->id)->where('unit_id', $employee->unit_id)->first();
        if ($myEmployee) {
            $rank = $myEmployee->rank->isLowerThan($employeeDTO->rank) ? $myEmployee->rank : $employeeDTO->rank;
            if($myEmployee->id === $employee->id) $rank = $myEmployee->rank;
            $employee->update(
                [
                    'rank' => $rank,
                    'name' => $employeeDTO->name,
                    'note' => $employeeDTO->note,
                    'text_color' => $employeeDTO->textColor,
                    'bg_color' => $employeeDTO->bgColor,
                    'sort' => $employeeDTO->sort,
                    'hidden' => $employeeDTO->hidden,
                ]
            );
            Cache::store('redis')->tags('unit_'.$employee->unit_id)->flush();
            return $employee;
        }
        throw new ModelNotFoundException('Employee not found.');
    }

    /**
     * @throws \Exception
     */
    public function invite(Employee $employee, User $user): Employee
    {
        if($employee->user_id){
            throw new \Exception('Create invite is forbidden.');
        }

        // who update information
        $myEmployee = Employee::query()->where('user_id', $user->id)->where('unit_id', $employee->unit_id)->first();
        if ($myEmployee) {
            if ($myEmployee->rank->isNotLowerThan(Rank::Admin)) {
                $employee->update(
                    [
                        'invite' => Str::random(self::PASSWORD_LENGTH),
                        'expired_at' => Carbon::now()->addMinutes(self::TTL_INVITE_MINUTES),
                        'created_user_id' => $user->id,
                    ]
                );
                return $employee;
            }
        }
        throw new \Exception('Create invite is forbidden.');
    }

    /**
     * @throws \Exception
     */
    public function delete(Employee $employee, User $user): void
    {
        if($employee->user_id === $user->id) {
            throw new \Exception('Self-deletion is forbidden.');
        }

        // who update information
        $myEmployee = Employee::query()->where('user_id', $user->id)->where('unit_id', $employee->unit_id)->first();
        if ($myEmployee) {
            if ($myEmployee->rank->isNotLowerThan(Rank::Admin)) {
                Cache::store('redis')->tags('unit_'.$employee->unit_id)->flush();
                $employee->delete();
                return;
            }
        }
        throw new \Exception('Deletion forbidden.');
    }
}
