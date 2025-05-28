<?php
declare(strict_types=1);

namespace App\Services\Api;

use Kreait\Firebase\Factory;

class FirebaseService
{
    /**
     * @throws \Exception
     */
    public function handleGoogleOAuth(string $googleToken): array
    {
        $pathCredentials = storage_path(config('firebase.credentials'));
        $firebase = (new Factory)->withServiceAccount($pathCredentials);
        $auth = $firebase->createAuth();
        try {
            $verifiedIdToken = $auth->verifyIdToken($googleToken);
            $firebaseUser = $verifiedIdToken->claims();
            return [
                'email' => $firebaseUser->get('email'),
                'name' => $firebaseUser->get('name'),
            ];
        } catch (\Exception $exception) {
            throw new \Exception('Email is incorrect from firebase.');
        }
    }
}
