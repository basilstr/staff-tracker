<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StatusResource;
use App\Http\Resources\UnitResource;
use App\Requests\Api\StatusRequest;
use App\Requests\Api\UnitRequest;
use App\Services\Api\StatusService;
use App\Services\Api\UnitService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response;

class UnitController extends Controller
{
    public function index(UnitService $service)
    {
        return  UnitResource::collection($service->list(auth()->user()));
    }

    public function update(UnitRequest $request, UnitService $service): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $service->update(auth()->user(), $request->validated());
        return UnitResource::collection($service->list(auth()->user()));
    }
}
