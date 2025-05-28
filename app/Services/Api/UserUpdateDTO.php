<?php
declare(strict_types=1);

namespace App\Services\Api;

class UserUpdateDTO
{
    public function __construct(
        public string $name,
        public string $password,
    )
    {
    }
}
