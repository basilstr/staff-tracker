<?php
declare(strict_types=1);

namespace App\Services\Api;

use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Kreait\Firebase\Factory;

class UserService
{
    private $firebaseService;
    public function __construct(FirebaseService $firebaseService)
    {
        $this->firebaseService = $firebaseService;
    }

    /**
     * @throws \Exception
     */
    public function handle(UserDTO $tokenDTO): User|\Exception
    {
        if($tokenDTO->googleToken) {
            return $this->checkToken($tokenDTO);
        }else{
            return $this->checkEmailPass($tokenDTO);
        }
    }

    public function invite(User $user): User
    {
        $user->update(
            [
                'invite' => Str::random(User::DEFAULT_PASSWORD_LENGHT),
                'expired_at' => Carbon::now()->addMinutes(User::DEFAULT_EXPIRED_INVITE),
            ]
        );
        return $user;
    }

    /**
     * @throws \Exception
     */
    public function join(JoinDTO $tokenDTO, User $user): string
    {
        $inviteEmployee = Employee::query()
            ->whereNull('user_id')
            ->where('invite', $tokenDTO->invite)
            ->where('expired_at', '>', Carbon::now())
            ->first();
        if ($inviteEmployee) {
            $inviteEmployee->update(['user_id' => $user->id, 'invite' => null, 'expired_at' => null]);
            return $inviteEmployee->unit->name;
        }
        throw new \Exception('Invite is incorrect.');
    }

    public function update(UserUpdateDTO $tokenDTO, User $user): User
    {
        $user->name = $tokenDTO->name;
        if($tokenDTO->password) $user->password = Hash::make($tokenDTO->password);
        $user->save();
        return $user;
    }

    public function destroy(User $user): void
    {
        Employee::where('user_id', $user->id)->update(['user_id' => null]);
        $user->delete();
    }

    /**
     * @throws ValidationException
     * @throws \Exception
     */
    private function checkToken(UserDTO $tokenDTO): User
    {
        $firebaseData = $this->firebaseService->handleGoogleOAuth($tokenDTO->googleToken);

        if ($tokenDTO->invite) {
            $inviteEmployee = Employee::query()
                ->whereNull('user_id')
                ->where('invite', $tokenDTO->invite)
                ->where('expired_at', '>', Carbon::now())
                ->first();
            if ($inviteEmployee) {
                $newUser = User::where('email', $firebaseData['email'])->first();
                if (!$newUser) {
                    $newUser = User::create(
                        [
                            'name' => $firebaseData['name'],
                            'email' => $firebaseData['email'],
                            'invite_user_id' => $inviteEmployee->created_user_id,
                            'password' => Hash::make('password'),
                            'email_verified_at' => now(),
                            'remember_token' => Str::random(User::DEFAULT_PASSWORD_LENGHT),
                        ]
                    );
                }
                $inviteEmployee->update(['user_id' => $newUser->id, 'invite' => null, 'expired_at' => null]);
                return $newUser;
            }

            // користувач, який запрошує
            $inviteUser = User::query()
                ->where('invite', $tokenDTO->invite)
                ->where('expired_at', '>', Carbon::now())
                ->first();
            if ($inviteUser) {
                $newUser = User::where('email', $firebaseData['email'])->first();
                if (!$newUser) {
                    $newUser = User::create(
                        [
                            'name' => $firebaseData['name'],
                            'email' => $firebaseData['email'],
                            'invite_user_id' => $inviteUser->id,
                            'password' => Hash::make('password'),
                            'email_verified_at' => now(),
                            'remember_token' => Str::random(User::DEFAULT_PASSWORD_LENGHT),
                        ]
                    );
                }
                return $newUser;
            }
            throw new \Exception('Invite is incorrect.');
        }

        // проста реєстрація через гугл акаунт
        $newUser = User::where('email', $firebaseData['email'])->first();
        if ($newUser) return $newUser;

        throw new \Exception('Email is incorrect.');
    }

    /**
     * @throws \Exception
     */
    private function checkEmailPass(UserDTO $tokenDTO): User
    {
        $user = User::query()->where('email', $tokenDTO->email)->first();

        if (!$user) {
            throw new \Exception('The provided credentials are incorrect.');
        }

        if (!Hash::check($tokenDTO->password, $user->password)) {
            throw new \Exception('The provided credentials are incorrect.');
        }

        return $user;
    }
}
