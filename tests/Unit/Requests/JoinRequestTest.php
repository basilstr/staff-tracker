<?php
use App\Requests\Api\JoinRequest;
use App\Services\Api\JoinDTO;
use Illuminate\Routing\Redirector;

covers(JoinRequest::class);

describe('JoinRequest', function () {

    it('check rules', function () {
        $request = new JoinRequest();
        expect($request->rules())->toBe([
            'invite' => 'required|string',
        ]);
    });

    it('check messages', function () {
        $request = new JoinRequest();
        expect($request->messages())->toBe([
            'invite.required' => 'Field "invite" is required.',
            'invite.string' => 'Field "invite" must be a string.',
        ]);
    });

    it('authorize returns true', function () {
        $request = new JoinRequest();
        expect($request->authorize())->toBeTrue();
    });

    it('validates invite correctly', function () {
        $request = new JoinRequest();

        $request->merge([
            'invite' => 'test_invite_code',
        ]);

        $request
            ->setContainer(app())
            ->setRedirector(app(Redirector::class))
            ->validateResolved();
        $dto = $request->getDTO();

        expect($dto)->toBeInstanceOf(JoinDTO::class)
            ->and($dto->invite)->toBe('test_invite_code');
    });

    it('check missing invite field', function () {
        $request = new JoinRequest();
        $request->merge([]);

        $request
            ->setContainer(app())
            ->setRedirector(app(Redirector::class));

        expect(fn() => $request->validateResolved())
            ->toThrow(\Illuminate\Validation\ValidationException::class);
    });
});
