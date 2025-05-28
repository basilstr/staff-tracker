<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\LogsChanges;
use Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Unit
 *
 * @property int $id
 * @property string $sort
 */
class Unit extends Model
{
    /** @use HasFactory<UnitFactory> */
    use HasFactory, SoftDeletes, LogsChanges;

    protected $fillable = [
        'name',
        'sort',
    ];
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function statuses(): HasMany
    {
        return $this->hasMany(Status::class);
    }
}
