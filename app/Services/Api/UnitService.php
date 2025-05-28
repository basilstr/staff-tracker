<?php
declare(strict_types=1);

namespace App\Services\Api;

use App\Enums\Rank;
use App\Models\Employee;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class UnitService
{
    public function list(User $user): Collection
    {
        return Unit::whereHas('employees', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->where('rank', '>', Rank::Forbidden->value);
            })
            ->distinct()
            ->get();
    }

    public function update(User $user, array $data): void
    {
        // List of units where the user is the unit owner.
        $ids = Unit::whereHas('employees', function ($query) use ($user) {
                $query->where('user_id', $user->id);
                $query->where('rank', Rank::Owner);
            })
            ->distinct()
            ->pluck('id', 'id')
            ->toArray();
        DB::transaction(function () use ($data, $user, $ids) {
            foreach ($data as $item) {
                $id = $item['id'] ?? null;

                // if the user wants to change another group (not the owner of the group)
                if($id && !in_array($item['id'], $ids))  continue;

                $unit = Unit::updateOrCreate(
                    ['id' => $id],
                    [
                        'sort' => $item['sort'],
                        'name' => $item['name'],
                    ]
                );

                unset($ids[$item['id']]);
                if(empty($id)) {
                    Employee::create([
                        'user_id' => $user->id,
                        'unit_id' => $unit->id,
                        'name' => $user->name,
                        'rank' => Rank::Owner->value,
                        'created_user_id' => $user->id,
                    ]);

                    $statuses = config('statuses.init');
                    foreach ($statuses as $status) {
                        $status['unit_id'] = $unit->id;
                        Status::create($status);
                    }
                }
            }
            Unit::whereIn('id', $ids)->delete();
        });
    }
}
