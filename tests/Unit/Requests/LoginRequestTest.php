<?php
use App\Requests\Api\LoginRequest;
use App\Services\Api\UserDTO;
use Illuminate\Routing\Redirector;

covers(LoginRequest::class);

describe('LoginRequest', function () {

    it('check rules', function () {

        $request = new LoginRequest();
        expect($request->rules())->toBe([
            'email' => 'nullable|email|required_without:google_token',
            'password' => 'nullable|string|required_without:google_token',
            'google_token' => 'nullable|string|required_without:email,password',
            'invite' => 'nullable|string',
        ]);
    });

    it('check messages', function () {

        $request = new LoginRequest();
        expect($request->messages())->toBe([
            'email.required_without' => 'Field "email" is required when "google_token" is not provided.',
            'password.required_without' => 'Field "password" is required when "google_token" is not provided.',
            'google_token.required_without' => 'Field "google_token" is required when neither "email" nor "password" are provided.',

            'email.email' => 'Field "email" is not a valid email.',
            'password.string' => 'Field "password" must be a string.',
            'google_token.string' => 'Field "google_token" must be a string.',
            'invite.string' => 'Field "google_token" must be a string.',
        ]);
    });

    it('authorize returns true', function () {
        $request = new LoginRequest();
        expect($request->authorize())->toBeTrue();
    });

    it('validates email and password correctly', function () {

        $request = new LoginRequest();

        $request->merge([
            'email' => 'test@example.com',
            'password' => 'password123',
            'google_token' => 'google_token',
            'invite' => 'invite',
        ]);
        $request
            ->setContainer(app())
            ->setRedirector(app(Redirector::class))
            ->validateResolved();
        $dto = $request->getDTO();

        expect($dto)->toBeInstanceOf(UserDTO::class)
        ->and($dto->email)->toBe('test@example.com')
        ->and($dto->password)->toBe('password123')
        ->and($dto->googleToken)->toBe('google_token')
        ->and($dto->invite)->toBe('invite');
    });

    it('check only email and password present', function () {

        $request = new LoginRequest();
        $request->merge([
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $request
            ->setContainer(app())
            ->setRedirector(app(Redirector::class))
            ->validateResolved();
        $dto = $request->getDTO();

        expect($dto)->toBeInstanceOf(UserDTO::class)
            ->and($dto->email)->toBe('test@example.com')
            ->and($dto->password)->toBe('password123')
            ->and($dto->googleToken)->toBe('');
    });

    it('check only google_token present', function () {

        $request = new LoginRequest();
        $request->merge([
            'google_token' => 'google_token',
        ]);

        $request
            ->setContainer(app())
            ->setRedirector(app(Redirector::class))
            ->validateResolved();
        $dto = $request->getDTO();

        expect($dto)->toBeInstanceOf(UserDTO::class)
            ->and($dto->email)->toBe('')
            ->and($dto->password)->toBe('')
            ->and($dto->googleToken)->toBe('google_token');
    });

    it('check google_token without invite', function () {

        $request = new LoginRequest();
        $request->merge([
            'google_token' => 'google_token',
        ]);

        $request
            ->setContainer(app())
            ->setRedirector(app(Redirector::class))
            ->validateResolved();

        $dto = $request->getDTO();

        expect($dto)->toBeInstanceOf(UserDTO::class)
            ->and($dto->email)->toBe('')
            ->and($dto->password)->toBe('')
            ->and($dto->googleToken)->toBe('google_token')
            ->and($dto->invite)->toBe('');
    });
});
