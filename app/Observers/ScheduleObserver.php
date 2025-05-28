<?php

namespace App\Observers;

use App\Models\Schedule;
use App\Models\ScheduleLog;

class ScheduleObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(Schedule $schedule): void
    {
        ScheduleLog::create([
            'schedule_id' => $schedule->id,
            'user_id' => auth()->id(),
            'status_id' => $schedule->status_id,
            'note' => $schedule->note,
        ]);
    }

    /**
     * Handle the Schedule "updated" event.
     */
    public function updated(Schedule $schedule): void
    {
        ScheduleLog::create([
            'schedule_id' => $schedule->id,
            'user_id' => auth()->id(),
            'status_id' => $schedule->status_id,
            'note' => $schedule->note,
        ]);
    }
}
