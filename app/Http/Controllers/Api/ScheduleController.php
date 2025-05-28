<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Requests\Api\ScheduleEmployeeRequest;
use App\Requests\Api\ScheduleGroupRequest;
use App\Services\Api\ScheduleService;
use Symfony\Component\HttpFoundation\Response;

class ScheduleController extends Controller
{
    public function list($id, $from, $to, ScheduleService $service): \Illuminate\Http\JsonResponse
    {
        $unit = $service->findUnit($id);
        if (!$unit) return response()->json(['message' => 'Unit not found'], Response::HTTP_NOT_FOUND);

        $data = $service->list($unit, $from, $to);
        return response()->json($data);
    }

    public function group($id, $from, $to, ScheduleGroupRequest $request, ScheduleService $service): \Illuminate\Http\JsonResponse
    {
        $unit = $service->findUnit($id);
        if (!$unit) return response()->json(['message' => 'Unit not found'], Response::HTTP_NOT_FOUND);

        $service->setGroup($unit, $request->getDTO());
        $data = $service->list($unit, $from, $to);
        return response()->json($data);
    }

    public function employee($id, $from, $to, ScheduleEmployeeRequest $request, ScheduleService $service): \Illuminate\Http\JsonResponse
    {
        $employee = $service->findEmployee($id);
        if (!$employee) return response()->json(['message' => 'Employee not found'], Response::HTTP_NOT_FOUND);

        $unit = $employee->unit;
        if (!$unit) return response()->json(['message' => 'Unit not found'], Response::HTTP_NOT_FOUND);

        $service->setEmployee($employee, $request->getDTO());
        $data = $service->list($unit, $from, $to);
        return response()->json($data);
    }
}
