<?php
declare(strict_types=1);

namespace App\Services\Api;

use Carbon\Carbon;

class ScheduleGroupDTO
{
    public function __construct(
        public int $status,
        public Carbon $date,
    )
    {
    }
}

