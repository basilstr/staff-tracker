<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InviteResource;
use App\Http\Resources\LoginResource;
use App\Requests\Api\JoinRequest;
use App\Requests\Api\LoginRequest;
use App\Requests\Api\UserUpdateRequest;
use App\Services\Api\UserService;
use Symfony\Component\HttpFoundation\Response;


class UserController extends Controller
{
    /**
     * @throws \Exception
     */
    public function login(LoginRequest $request, UserService $tokenService): LoginResource|\Illuminate\Http\JsonResponse
    {
        try {
            $user = $tokenService->handle($request->getDTO());
            return (new LoginResource($user, [
                "token" => $user->createToken($user->email)->plainTextToken,
            ]));
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function invite(UserService $tokenService): InviteResource
    {
        return new InviteResource($tokenService->invite(auth()->user()));
    }

    public function update(UserUpdateRequest $request, UserService $tokenService): LoginResource|\Illuminate\Http\JsonResponse
    {
        $user = $tokenService->update($request->getDTO(), auth()->user());
        return new LoginResource($user);
    }
    public function destroy(UserService $tokenService): \Illuminate\Http\JsonResponse
    {
        $tokenService->destroy(auth()->user());
        return response()->json(['message' => __('User is deleted')], Response::HTTP_OK);
    }

    public function join(JoinRequest $request, UserService $tokenService): \Illuminate\Http\JsonResponse
    {
        try {
            $unitName = $tokenService->join($request->getDTO(), auth()->user());
            return response()->json(['message' => __('Join is success to :unitName', ['unitName' => $unitName])], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_FORBIDDEN);
        }
    }
}
