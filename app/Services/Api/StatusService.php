<?php
declare(strict_types=1);

namespace App\Services\Api;

use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class StatusService
{
    public function findUnit($id)
    {
        return Unit::find($id);
    }

    public function list(Unit $unit): Collection
    {
        return  Status::withTrashed()->where('unit_id', $unit->id)->get();
    }

    public function update(Unit $unit, $data): void
    {
        $ids = Status::query()->where('unit_id', $unit->id)->pluck('id', 'id')->toArray();
        $idsDeleted = Status::onlyTrashed()->where('unit_id', $unit->id)->pluck('id', 'id')->toArray();

        foreach ($data as $item) {
            if (isset($idsDeleted[$item['id']])) continue;

            Status::updateOrCreate(
                ['id' => $item['id'] ?? null],
                [
                    'unit_id' => $unit->id,
                    'sort' => $item['sort'],
                    'name' => $item['name'],
                    'short_name' => $item['short_name'],
                    'is_group' => $item['is_group'],
                    'text_color' => $item['text_color'],
                    'bg_color' => $item['bg_color'],
                ]
            );
            unset($ids[$item['id']]);
        }
        Status::whereIn('id', $ids)->delete();
    }
}
