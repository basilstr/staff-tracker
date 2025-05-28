<?php
declare(strict_types=1);

namespace App\Services\Api;

use App\Models\Employee;
use App\Models\Schedule;
use App\Models\ScheduleLog;
use App\Models\Unit;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Cache;

class ScheduleService
{
    public function findUnit($id)
    {
        return Unit::find($id);
    }

    public function findEmployee($id)
    {
        return Employee::find($id);
    }

    public function list(Unit $unit, $from, $to): array
    {
        $cacheKey = sprintf('schedule-unit-%s-%s-%s', $unit->id, $from, $to);
        return Cache::store('redis')->tags(['unit_'.$unit->id])->remember($cacheKey, config('cache.cache_ttl'), function () use ($unit, $from, $to) {
            return $this->detail($unit, $from, $to);
        });
    }

    private function detail(Unit $unit, $from, $to): array
    {
        $data = [];

        // init array
        $startDate = Carbon::parse($from);
        $endDate = Carbon::parse($to);
        $dates = CarbonPeriod::create($startDate, $endDate)->toArray();
        $datesArray = array_map(fn($date) => $date->toDateString(), $dates);
        foreach ($datesArray as $date) {
            $data[$date] = [
                'unit' => $unit->id,
                'schedule' => [],
                'note' => [],
                'log' => [],
            ];
        }

        // fill from DB
        $schedules = Schedule::whereHas('employee', function ($query) use ($unit) {
            $query->where('unit_id', $unit->id);
        })
            ->whereBetween('schedule_date', [Carbon::parse($from)->format('Y-m-d'), Carbon::parse($to)->format('Y-m-d')])
            ->get();
        foreach ($schedules as $schedule) {
            $schedule_date = $schedule->schedule_date->format('Y-m-d');
            $data[$schedule_date]['schedule'][$schedule->employee_id] = $schedule->status_id;
            if (!empty($schedule->note)) $data[$schedule_date]['note'][$schedule->employee_id] = $schedule->note;
            /** @var ScheduleLog $log */
            foreach ($schedule->scheduleLogs as $log) {
                $data[$schedule_date]['log'][$schedule->employee_id][] = __(':date user :user set status :status', [
                    'date' =>$log->created_at->format('d.m.Y'),
                    'user' => $log->user->name,
                    'status' => $log->status->name,
                ]);
            }
        }

        return $data;
    }

    public function setGroup(Unit $unit, ScheduleGroupDTO $groupDTO)
    {
        $employeeIds = Employee::where('unit_id', $unit->id)->pluck('id')->toArray();
        foreach ($employeeIds as $employeeId) {
            Schedule::firstOrCreate(
                [
                    'employee_id' => $employeeId,
                    'schedule_date' => $groupDTO->date
                ],
                [
                    'status_id' => $groupDTO->status,
                ]
            );
        };

        Cache::store('redis')->tags('unit_'.$unit->id)->flush();
    }

    public function setEmployee(Employee $employee, ScheduleEmployeeDTO $groupDTO)
    {
        while($groupDTO->from->startOfDay() <= $groupDTO->to->startOfDay()) {
            Schedule::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'schedule_date' => $groupDTO->from->format('Y-m-d'),
                ],
                [
                    'status_id' => $groupDTO->status,
                    'note' => $groupDTO->note,
                ]
            );
            $groupDTO->from->addDay();
        }

        Cache::store('redis')->tags('unit_'.$employee->unit_id)->flush();
    }
}
