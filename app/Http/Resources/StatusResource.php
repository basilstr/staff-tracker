<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StatusResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            "id" => $this->resource->id,
            "sort" => $this->resource->sort,
            "name" =>$this->resource->name,
            "short_name" =>$this->resource->short_name,
            "is_group" =>$this->resource->is_group,
            "text_color" =>$this->resource->text_color,
            "bg_color" =>$this->resource->bg_color,
            "deleted_at" =>$this->resource->deleted_at?->format('Y-m-d H:i:s'),
        ];
    }
}
