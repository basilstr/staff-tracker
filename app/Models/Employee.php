<?php
declare(strict_types=1);

namespace App\Models;

use App\Enums\Rank;
use App\Traits\LogsChanges;
use Carbon\Carbon;
use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Employee
 *
 * @property int $user_id
 * @property int $created_user_id
 * @property int $unit_id
 * @property int $hidden
 * @property string $name
 * @property string $note
 * @property string $text_color
 * @property string $bg_color
 * @property int $sort
 * @property string $invite
 * @property Carbon $expired_at
 * @property-read User $user
 * @property-read Unit $unit
 * @property-read User $createUser
 * @property-read Rank $rank
 * @property-read Schedule[] $schedules
 */
class Employee extends Model
{
    /** @use HasFactory<EmployeeFactory> */
    use HasFactory, SoftDeletes, LogsChanges;
    protected $fillable = [
        'user_id',
        'unit_id',
        'created_user_id',
        'rank',
        'hidden',
        'name',
        'note',
        'text_color',
        'bg_color',
        'sort',
        'invite',
        'expired_at',
    ];

    protected function casts(): array
    {
        return [
            'rank' => Rank::class,
            'expired_at' => 'datetime',
        ];
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function createUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_user_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
