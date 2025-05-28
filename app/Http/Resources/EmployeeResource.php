<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            "id" => $this->resource->id,
            "user_id" => $this->resource->user_id,
            "unit_id" => $this->resource->unit_id,
            "name" => $this->resource->name,
            "rank" => $this->resource->rank->value,
            "hidden" => $this->resource->hidden,
            "note" => $this->resource->note,
            "text_color" => $this->resource->text_color,
            "bg_color" => $this->resource->bg_color,
            "sort" => $this->resource->sort,
        ];
    }
}
