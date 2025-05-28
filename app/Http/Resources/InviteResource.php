<?php

namespace App\Http\Resources;

use App\Models\Invitable;
use Illuminate\Http\Resources\Json\JsonResource;

class InviteResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            "invite" => $this->resource->invite,
            "expired_at" => $this->resource->expired_at->format('Y-m-d H:i:s'),
        ];
    }
}
