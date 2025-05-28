<?php

use Illuminate\Support\Facades\Route;

Route::get('{any?}', function () {
    $response = response()->view('app');
    $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    return $response;
})->where('any', '.*');

