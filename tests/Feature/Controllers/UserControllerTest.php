<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Resources\InviteResource;
use App\Http\Resources\LoginResource;
use App\Models\Employee;
use App\Models\Unit;
use App\Models\User;
use App\Requests\Api\JoinRequest;
use App\Requests\Api\LoginRequest;
use App\Requests\Api\UserUpdateRequest;
use App\Services\Api\FirebaseService;
use App\Services\Api\JoinDTO;
use App\Services\Api\UserDTO;
use App\Services\Api\UserService;
use App\Services\Api\UserUpdateDTO;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

mutates(UserController::class);

describe('User Controller', function () {
    it('logs in with a google_token', function () {
        $user = User::factory()->create();
        $tokenDTO = Mockery::mock(UserDTO::class);
        $tokenDTO->google_token = 'valid_token';

        $request = Mockery::mock(LoginRequest::class);
        $request->shouldReceive('getDTO')->andReturn($tokenDTO);

        $userService = Mockery::mock(UserService::class);
        $userService->shouldReceive('handle')->andReturn($user);

        $response = (new UserController())->login($request, $userService);

        $responseArray = $response->toArray(request());

        expect($responseArray)->toBeArray()
            ->and($responseArray['token'])->toBeString();
    });

    it('logs in with a google_token - delete and login again with registration user', function () {
        $user = User::factory()->create([
            'name' => 'user',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);
        $user->delete();

        //================================

        $unit = Unit::factory()->create(['name' => 'Unit name']);
        Employee::factory()->create(['user_id' => null, 'unit_id' => $unit->id, 'invite' => 'invite', 'expired_at' => Carbon::now()->addDay()]);

        $tokenDTO = new UserDTO('', '', 'valid_token', 'invite');

        $request = Mockery::mock(LoginRequest::class);
        $request->shouldReceive('getDTO')->andReturn($tokenDTO);

        $mockFirebaseService = $this->createMock(FirebaseService::class);

        // Визначаємо, що метод handle() має повернути фіктивний результат
        $mockFirebaseService->method('handleGoogleOAuth')->willReturn([
            'email' => 'test@example.com',
            'name' => 'user',
        ]);

        $service = new UserService($mockFirebaseService);

        (new UserController())->login($request, $service);
        $users = User::withTrashed()->where('email', 'test@example.com')->get();

        expect($users)->toHaveCount(2);
    });

    it('fails login with invalid credentials', function () {
        $tokenDTO = Mockery::mock(UserDTO::class);
        $tokenDTO->google_token = '';
        $tokenDTO->email = 'invalid@example.com';
        $tokenDTO->password = 'wrong_password';

        $request = Mockery::mock(LoginRequest::class);
        $request->shouldReceive('getDTO')->andReturn($tokenDTO);

        $userService = Mockery::mock(UserService::class);
        $userService->shouldReceive('handle')->andThrow(
            ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ])
        );

        $response = (new UserController())->login($request, $userService);

        expect($response)->toBeInstanceOf(JsonResponse::class)
            ->and($response->getStatusCode())->toBe(Response::HTTP_UNAUTHORIZED)
            ->and($response->getData(true))->toHaveKey('message')
            ->and($response->getData(true)['message'])->toBe('Invalid credentials');
    });

    it('user invites', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $userService = Mockery::mock(UserService::class);
        $userService->shouldReceive('invite')->andReturn($user);

        $response = (new UserController())->invite($userService);

        expect($response)->toBeInstanceOf(InviteResource::class);
    });

    it('user update', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $userUpdateDTO = new UserUpdateDTO('new name', '');

        $request = Mockery::mock(UserUpdateRequest::class);
        $request->shouldReceive('getDTO')->andReturn($userUpdateDTO);

        $mockFirebaseService = $this->createMock(FirebaseService::class);

        // Визначаємо, що метод handleGoogleOAuth() має повернути фіктивний результат
        $mockFirebaseService->method('handleGoogleOAuth')->willReturn([
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);

        $service = new UserService($mockFirebaseService);

        $response = (new UserController())->update($request, $service);
        expect($response)->toBeInstanceOf(LoginResource::class);
    });

    it('user destroy', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $mockFirebaseService = $this->createMock(FirebaseService::class);

        // Визначаємо, що метод handle() має повернути фіктивний результат
        $mockFirebaseService->method('handleGoogleOAuth')->willReturn([
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);

        $service = new UserService($mockFirebaseService);

        $response = (new UserController())->destroy($service);
        expect($response)->toBeInstanceOf(JsonResponse::class)
            ->and($response->getStatusCode())->toBe(Response::HTTP_OK);
    });

    it('user join', function () {
        $unit = Unit::factory()->create(['name' => 'Unit name']);
        $user = User::factory()->create();
        $this->actingAs($user);

        Employee::factory()->create(['user_id' => null, 'unit_id' => $unit->id, 'invite' => 'invite', 'expired_at' => Carbon::now()->addDay()]);

        $userUpdateDTO = new JoinDTO('invite');

        $request = Mockery::mock(JoinRequest::class);
        $request->shouldReceive('getDTO')->andReturn($userUpdateDTO);

        $mockFirebaseService = $this->createMock(FirebaseService::class);

        // Визначаємо, що метод handle() має повернути фіктивний результат
        $mockFirebaseService->method('handleGoogleOAuth')->willReturn([
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);
        $service = new UserService($mockFirebaseService);

        $response = (new UserController())->join($request, $service);
        expect($response)->toBeInstanceOf(JsonResponse::class)
            ->and($response->getStatusCode())->toBe(Response::HTTP_OK)
            ->and($response->getData(true))->toHaveKey('message')
            ->and($response->getData(true)['message'])->toBe('Join is success to Unit name');
    });

    it('user error join', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        Employee::factory()->create(['user_id' => null, 'invite' => 'invite', 'expired_at' => Carbon::now()->addDay()]);

        $userUpdateDTO = new JoinDTO('wrong_invite');

        $request = Mockery::mock(JoinRequest::class);
        $request->shouldReceive('getDTO')->andReturn($userUpdateDTO);

        $mockFirebaseService = $this->createMock(FirebaseService::class);

        // Визначаємо, що метод handle() має повернути фіктивний результат
        $mockFirebaseService->method('handleGoogleOAuth')->willReturn([
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);
        $service = new UserService($mockFirebaseService);

        $response = (new UserController())->join($request, $service);
        expect($response)->toBeInstanceOf(JsonResponse::class)
            ->and($response->getStatusCode())->toBe(Response::HTTP_FORBIDDEN)
            ->and($response->getData(true))->toHaveKey('message')
            ->and($response->getData(true)['message'])->toBe('Invite is incorrect.');
    });
});
