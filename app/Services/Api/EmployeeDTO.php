<?php
declare(strict_types=1);

namespace App\Services\Api;

use App\Enums\Rank;

class EmployeeDTO
{
    public function __construct(
        public int $id,
        public Rank $rank,
        public string $name,
        public string $note,
        public string $textColor,
        public string $bgColor,
        public int $sort,
        public int $hidden,
    )
    {
    }
}

