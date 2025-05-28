<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StatusResource;
use App\Models\Unit;
use App\Requests\Api\StatusRequest;
use App\Services\Api\StatusService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StatusController extends Controller
{
    public function index($id, StatusService $service): \Illuminate\Http\JsonResponse|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $unit = $service->findUnit($id);
        if (!$unit) return response()->json(['message' => 'Unit not found'], Response::HTTP_NOT_FOUND);

        return  StatusResource::collection($service->list($unit));
    }

    public function update($id, StatusRequest $request, StatusService $service): \Illuminate\Http\JsonResponse|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $unit = $service->findUnit($id);
        if (!$unit) return response()->json(['message' => 'Unit not found'], Response::HTTP_NOT_FOUND);

        $service->update($unit, $request->validated());
        return StatusResource::collection($service->list($unit));
    }
}
