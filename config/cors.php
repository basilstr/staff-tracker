<?php

return [
    'paths' => ['api/*'], // Дозволені URL-шляхи
    'allowed_methods' => ['*'], // Дозволені методи (GET, POST тощо)
    'allowed_origins' => ['http://localhost:5173'], // Дозволені джерела
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Дозволені заголовки
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, // true, якщо потрібна авторизація через cookies
];
