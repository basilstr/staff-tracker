<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\LogsChanges;
use Database\Factories\StatusFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Status extends Model
{
    /** @use HasFactory<StatusFactory> */
    use HasFactory, SoftDeletes, LogsChanges;

    protected $fillable = [
        'unit_id',
        'sort',
        'name',
        'short_name',
        'is_group',
        'text_color',
        'bg_color',
    ];

    protected function casts(): array
    {
        return [
            'is_group' => 'boolean',
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
