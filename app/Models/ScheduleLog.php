<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\LogsChanges;
use Database\Factories\ScheduleLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Unit
 *
 * @property int $user_id
 * @property int $schedule_id
 * @property int $status_id
 * @property string $note
 * @property-read User $user
 * @property-read Schedule $schedule
 * @property-read Status $status
 */
class ScheduleLog extends Model
{
    /** @use HasFactory<ScheduleLogFactory> */
    use HasFactory, LogsChanges;

    protected $fillable = [
        'schedule_id',
        'user_id',
        'status_id',
        'note',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
}
