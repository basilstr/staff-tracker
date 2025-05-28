<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InviteResource;
use App\Http\Resources\EmployeeResource;
use App\Requests\Api\EmployeeRequest;
use App\Services\Api\EmployeeService;
use Symfony\Component\HttpFoundation\Response;

class EmployeeController extends Controller
{
    public function index($id, EmployeeService $service): \Illuminate\Http\JsonResponse|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $unit = $service->findUnit($id);
        if (!$unit) return response()->json(['message' => 'Unit not found'], Response::HTTP_NOT_FOUND);

        return EmployeeResource::collection($service->list($unit));
    }

    public function store($id, EmployeeRequest $request, EmployeeService $service): \Illuminate\Http\JsonResponse|EmployeeResource
    {
        $unit = $service->findUnit($id);
        if (!$unit) return response()->json(['message' => 'Unit not found'], Response::HTTP_NOT_FOUND);

        try {
            return new EmployeeResource($service->store($unit, auth()->user(), $request->getDTO()));
        }catch (\Exception $exception){
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_FORBIDDEN);
        }
    }

    public function show($id, EmployeeService $service): EmployeeResource|\Illuminate\Http\JsonResponse
    {
        $employee = $service->findEmployee($id);
        if (!$employee) return response()->json(['message' => 'Employee not found'], Response::HTTP_NOT_FOUND);

        return new EmployeeResource($employee);
    }

    public function invite($id, EmployeeService $service): \Illuminate\Http\JsonResponse|InviteResource
    {
        $employee = $service->findEmployee($id);
        if (!$employee) return response()->json(['message' => 'Employee not found'], Response::HTTP_NOT_FOUND);

        try {
            return new InviteResource($service->invite($employee, auth()->user()));
        }catch (\Exception $exception){
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_FORBIDDEN);
        }
    }

    public function update($id, EmployeeRequest $request, EmployeeService $service): \Illuminate\Http\JsonResponse|EmployeeResource
    {
        $employee = $service->findEmployee($id);
        if (!$employee) return response()->json(['message' => 'Employee not found'], Response::HTTP_NOT_FOUND);

        $employee = $service->update($employee, auth()->user(), $request->getDTO());
        return new EmployeeResource($employee);
    }

    public function destroy($id, EmployeeService $service): \Illuminate\Http\JsonResponse
    {
        $employee = $service->findEmployee($id);
        if (!$employee) return response()->json(['message' => 'Employee not found'], Response::HTTP_NOT_FOUND);

        try {
            $service->delete($employee, auth()->user());
            return response()->json(['message' => 'Employee deleted']);
        }catch (\Exception $exception){
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_FORBIDDEN);
        }
    }
}
