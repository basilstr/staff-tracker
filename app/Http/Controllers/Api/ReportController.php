<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Api\ReportService;
use Symfony\Component\HttpFoundation\Response;

class ReportController extends Controller
{
    public function statuses($id, $from, $to, ReportService $service): \Illuminate\Http\JsonResponse
    {
        $unit = $service->findUnit($id);
        if (!$unit) return response()->json(['message' => 'Unit not found'], Response::HTTP_NOT_FOUND);

        $data = $service->statuses($unit, $from, $to);
        return response()->json($data);
    }
}
