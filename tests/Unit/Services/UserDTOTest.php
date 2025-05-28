<?php

use App\Services\Api\UserDTO;

covers(UserDTO::class);

describe('User UserDTO', function () {

    it('UserDTO can be instantiated with email and password', closure: function () {
        $email = 'test@example.com';
        $password = 'securepassword';
        $token = '1234567890';
        $invite = 'asdffghj';

        $dto = new UserDTO($email, $password, $token, $invite);

        expect($dto)->toBeInstanceOf(UserDTO::class)
            ->and($dto->email)->toBe($email)
            ->and($dto->password)->toBe($password)
            ->and($dto->googleToken )->toBe($token)
            ->and($dto->invite )->toBe($invite);
    });
});
