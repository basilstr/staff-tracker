<?php

use App\Requests\Api\UserUpdateRequest;
use App\Services\Api\UserUpdateDTO;
use Illuminate\Routing\Redirector;

covers(UserUpdateRequest::class);

describe('UserUpdateRequest', function () {

    it('check rules', function () {
        $request = new UserUpdateRequest();
        expect($request->rules())->toBe([
            'name' => 'required|string',
            'password' => 'nullable|string',
        ]);
    });

    it('check messages', function () {
        $request = new UserUpdateRequest();
        expect($request->messages())->toBe([
            'name.required' => 'Field "name" is required.',
            'name.email' => 'Field "name" is not a valid email.',
            'password.string' => 'Field "password" must be a string.',
        ]);
    });

    it('authorize returns true', function () {
        $request = new UserUpdateRequest();
        expect($request->authorize())->toBeTrue();
    });

    it('validates name and password correctly', function () {
        $request = new UserUpdateRequest();
        $request->merge([
            'name' => 'John Doe',
            'password' => 'securepassword',
        ]);

        $request
            ->setContainer(app())
            ->setRedirector(app(Redirector::class))
            ->validateResolved();

        $dto = $request->getDTO();

        expect($dto)->toBeInstanceOf(UserUpdateDTO::class)
            ->and($dto->name)->toBe('John Doe')
            ->and($dto->password)->toBe('securepassword');
    });

    it('check only name present', function () {
        $request = new UserUpdateRequest();
        $request->merge([
            'name' => 'John Doe',
        ]);

        $request
            ->setContainer(app())
            ->setRedirector(app(Redirector::class))
            ->validateResolved();

        $dto = $request->getDTO();

        expect($dto)->toBeInstanceOf(UserUpdateDTO::class)
            ->and($dto->name)->toBe('John Doe')
            ->and($dto->password)->toBe('');
    });

    it('fails when name is missing', function () {
        $request = new UserUpdateRequest();
        $request->merge([
            'password' => 'securepassword',
        ]);

        $request->setContainer(app())->setRedirector(app(Redirector::class));

        expect(fn() => $request->validateResolved())->toThrow(
            Illuminate\Validation\ValidationException::class
        );
    });
});
