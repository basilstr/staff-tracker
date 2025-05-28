<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
{
    protected array $extraParams;
    public function __construct($resource, array $extraParams = [])
    {
        parent::__construct($resource);
        $this->extraParams = $extraParams;
    }
    public function toArray($request): array
    {
        return array_merge([
            "user_id" => $this->resource->id,
            "name" => $this->resource->name,
            "email" => $this->resource->email,
        ], $this->extraParams);
    }
}
