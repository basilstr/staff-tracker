<?php
declare(strict_types=1);

namespace App\Services\Api;

class JoinDTO
{
    public function __construct(
        public string $invite,
    )
    {
    }
}
