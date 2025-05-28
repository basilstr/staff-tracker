<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
trait LogsChanges
{
    public static function bootLogsChanges(): void
    {
        static::created(function (Model $model) {
            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'create',
                'model' => class_basename($model),
                'data' => $model->toArray(),
            ]);
        });

        static::updated(function (Model $model) {
            $changes = $model->getChanges();
            if (!empty($changes)) {
                ActivityLog::create([
                    'user_id' => auth()->id(),
                    'action' => 'update',
                    'model' => class_basename($model),
                    'data' => self::formatChanges($model),
                ]);
            }
        });

        static::deleted(function (Model $model) {
            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'delete',
                'model' => class_basename($model),
                'data' => $model->toArray(),
            ]);
        });
    }

    private static function formatChanges(Model $model): array
    {
        $changes = [];
        foreach ($model->getChanges() as $field => $newValue) {
            $changes[$field] = [
                'old' => $model->getOriginal($field),
                'new' => $newValue,
            ];
        }
        return $changes;
    }
}
