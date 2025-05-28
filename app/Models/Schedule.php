<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\LogsChanges;
use Carbon\Carbon;
use Database\Factories\ScheduleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


/**
 * App\Models\Schedule
 *
 * @property int $employee_id
 * @property Carbon $schedule_date
 * @property int $status_id
 * @property-read Employee $employee
 * @property-read Status $status
 */
class Schedule extends Model
{
    /** @use HasFactory<ScheduleFactory> */
    use HasFactory, LogsChanges;

    protected $fillable = [
        'employee_id',
        'status_id',
        'schedule_date',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'schedule_date' => 'datetime',
        ];
    }

    public function scheduleLogs(): HasMany
    {
        return $this->hasMany(ScheduleLog::class)->orderBy('id', 'desc');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
}
