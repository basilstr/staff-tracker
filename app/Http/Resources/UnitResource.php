<?php

namespace App\Http\Resources;

use App\Enums\Rank;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    public function toArray($request): array
    {
        $employee = $this->resource->employees->where('user_id', auth()->id())->first();
        return [
            "id" => $this->resource->id,
            "sort" => $this->resource->sort,
            "name" => $this->resource->name,
            "edited" => $employee->rank == Rank::Owner,
        ];
    }
}
