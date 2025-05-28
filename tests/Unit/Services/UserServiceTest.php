<?php

use App\Models\Employee;
use App\Models\Unit;
use App\Models\User;
use App\Services\Api\FirebaseService;
use App\Services\Api\UserDTO;
use App\Services\Api\UserService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

covers(UserService::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('securepassword'),
        'invite' => 'invite',
    ]);

    // Зберігаємо мок у $this->mockFirebaseService
    $this->mockFirebaseService = $this->createMock(FirebaseService::class);

    // Визначаємо фіктивний результат для handle()
    $this->mockFirebaseService->method('handleGoogleOAuth')->willReturn([
        'email' => 'test@example.com',
        'name' => 'Test User',
    ]);

    $this->service = new UserService($this->mockFirebaseService);
});

describe('User UserDTO', function () {
    it('UserService returns user for valid credentials', function () {
        $dto = new UserDTO('test@example.com', 'securepassword', '', '');

        $user = $this->service->handle($dto);
        expect($user)->toBeInstanceOf(User::class);
    });

    it('UserService throws exception for invalid credentials', function () {
        $dto = new UserDTO('test@example.com', 'wrongpassword', '', '');

        $this->service->handle($dto);
    })->throws(Exception::class);

    it('UserService invite', function () {
        Carbon::setTestNow('2025-03-11 12:00:00');
        $result = $this->service->invite($this->user);
        expect($result)->not->toBeNull()
            ->and(strlen($result->invite))->toBe(User::DEFAULT_PASSWORD_LENGHT)
            ->and($result->expired_at)->toEqual(Carbon::now()->addMinutes(User::DEFAULT_EXPIRED_INVITE));

        Carbon::setTestNow();
    });

    it('authenticates a Employee using a valid Firebase token', function () {
        $tokenDTO = new UserDTO('', '', 'valid_token', 'invite');

        $userService = new UserService($this->mockFirebaseService);
        $method = new ReflectionMethod(UserService::class, 'checkToken');
        $method->setAccessible(true);

        $unit = Unit::factory()->create();
        Employee::factory()->create(['user_id' => null, 'unit_id' => $unit->id, 'invite' => 'invite', 'expired_at' => Carbon::now()->addDay()]);

        $user = $method->invoke($userService, $tokenDTO);
        expect($user)->toBeInstanceOf(User::class);
    });

    it('authenticates a user using a valid Firebase token and create new user', function () {
        $tokenDTO = new UserDTO('', '', 'valid_token', 'invite');

        $userService = new UserService($this->mockFirebaseService);
        $method = new ReflectionMethod(UserService::class, 'checkToken');
        $method->setAccessible(true);

        $unit = Unit::factory()->create();
        Employee::factory()->create(['user_id' => null, 'unit_id' => $unit->id, 'invite' => 'invite', 'expired_at' => Carbon::now()->addDay()]);

        $user = $method->invoke($userService, $tokenDTO);
        expect($user)->toBeInstanceOf(User::class);
    });

    it('authenticates a user using a invalid Firebase token', function () {
        $tokenDTO = new UserDTO('', '', 'invalid_token', '');

        // реальний firebase
        $userService = new UserService(new FirebaseService());

        $method = new ReflectionMethod(UserService::class, 'checkToken');
        $method->setAccessible(true);

        $method->invoke($userService, $tokenDTO);
    })->throws(Exception::class);

    it('authenticates a user using a invalid Firebase token with invite', function () {
        $tokenDTO = new UserDTO('', '', 'invalid_token', 'invite');

        $userService = new UserService($this->mockFirebaseService);
        $method = new ReflectionMethod(UserService::class, 'checkToken');
        $method->setAccessible(true);

        $method->invoke($userService, $tokenDTO);
    })->throws(Exception::class);

    it('authenticates a user using a valid Firebase token', function () {
        $tokenDTO = new UserDTO('', '', 'valid_token', 'invite');

        // Зберігаємо мок у $this->mockFirebaseService
        $mockFirebaseService = $this->createMock(FirebaseService::class);

        // Визначаємо фіктивний результат для handle()
        $mockFirebaseService->method('handleGoogleOAuth')->willReturn([
            'email' => 'test2@example.com',
            'name' => 'Test User 2',
        ]);

        $userService = new UserService($mockFirebaseService);
        $method = new ReflectionMethod(UserService::class, 'checkToken');
        $method->setAccessible(true);

        $user = User::factory()->create([
            'invite' =>'invite',
            'expired_at' => Carbon::now()->addDay(),
        ]);

        $userReturn = $method->invoke($userService, $tokenDTO);
        expect($userReturn)->toBeInstanceOf(User::class)
        ->and($user->id)->not()->toBe($userReturn->id);
    });

    it('authenticates a user using a valid Firebase token only register', function () {
        $tokenDTO = new UserDTO('', '', 'wrong', '');

        // Зберігаємо мок у $this->mockFirebaseService
        $mockFirebaseService = $this->createMock(FirebaseService::class);

        // Визначаємо фіктивний результат для handle()
        $mockFirebaseService->method('handleGoogleOAuth')->willReturn([
            'email' => 'test2@example.com',
            'name' => 'Test User 2',
        ]);

        $userService = new UserService($mockFirebaseService);
        $method = new ReflectionMethod(UserService::class, 'checkToken');
        $method->setAccessible(true);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Email is incorrect.');

        $method->invoke($userService, $tokenDTO);
    });

    it('authenticates a user using a valid email and password', function () {
        $tokenDTO = new UserDTO('test@example.com', 'securepassword', '', '');

        $userService = new UserService($this->mockFirebaseService);
        $method = new ReflectionMethod(UserService::class, 'checkEmailPass');
        $method->setAccessible(true);

        $user = $method->invoke($userService, $tokenDTO);

        expect($user)->toBeInstanceOf(User::class);
    });

    it('authenticates a user using a invalid password', function () {
        $tokenDTO = new UserDTO('test@example.com', 'invalid_password', '', '');

        $userService = new UserService($this->mockFirebaseService);
        $method = new ReflectionMethod(UserService::class, 'checkEmailPass');
        $method->setAccessible(true);

        $method->invoke($userService, $tokenDTO);
    })->throws(Exception::class);

    it('authenticates a user using a invalid email ', function () {
        $tokenDTO = new UserDTO('wrong@example.com', 'password', '', '');

        $userService = new UserService($this->mockFirebaseService);
        $method = new ReflectionMethod(UserService::class, 'checkEmailPass');
        $method->setAccessible(true);

        $method->invoke($userService, $tokenDTO);
    })->throws(Exception::class);
});
