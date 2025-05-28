<?php
declare(strict_types=1);

namespace App\Services\Api;

class UserDTO
{
    public function __construct(
        public string $email,
        public string $password,
        public string $googleToken,
        public string $invite,
    )
    {
    }
}
