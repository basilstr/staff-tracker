<?php
declare(strict_types=1);

namespace App\Services\Api;

use Carbon\Carbon;

class ScheduleEmployeeDTO extends \App\Requests\Api\ScheduleEmployeeRequest
{
    public function __construct(
        public int $status,
        public Carbon $from,
        public Carbon $to,
        public string $note,
    )
    {
    }
}

