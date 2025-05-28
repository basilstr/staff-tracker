<?php
declare(strict_types=1);

namespace App\Services\Api;

use App\Models\Schedule;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class ReportService
{
    public function findUnit($id)
    {
        return Unit::find($id);
    }

    public function statuses(Unit $unit, $from, $to): array
    {
        $cacheKey = sprintf('report-statuses-%s-%s-%s', $unit->id, $from, $to);
        return Cache::store('redis')->tags(['unit_'.$unit->id])->remember($cacheKey, config('cache.cache_ttl'), function () use ($unit, $from, $to) {
            return $this->detail($unit, $from, $to);
        });
    }

    private function detail(Unit $unit, $from, $to): array
    {
        $data = [];

        // fill from DB
        $schedules = Schedule::whereHas('employee', function ($query) use ($unit) {
            $query->where('unit_id', $unit->id);
        })
            ->whereBetween('schedule_date', [Carbon::parse($from)->format('Y-m-d'), Carbon::parse($to)->format('Y-m-d')])
            ->get();

        /** @var Schedule $schedule */
        foreach ($schedules as $schedule) {
            if(!isset($data[$schedule->employee_id][$schedule->status_id])) {
                $data[$schedule->employee_id][$schedule->status_id] = [0, 0, 0];
            }

            if ($schedule->schedule_date->isSunday()) {
                $data[$schedule->employee_id][$schedule->status_id][2]++;
            } elseif ($schedule->schedule_date->isSaturday()) {
                $data[$schedule->employee_id][$schedule->status_id][1]++;
            }else{
                $data[$schedule->employee_id][$schedule->status_id][0]++;
            }
        }

        return [
            'unit' => $unit->id,
            'date_from' => $from,
            'date_to' => $to,
            'report' => $data,
        ];
    }
}
