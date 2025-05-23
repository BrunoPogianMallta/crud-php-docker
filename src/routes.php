<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/controllers/PostController.php';

$db = Database::connect();
$router = new Router($db);


$router->add('POST', '/register', AuthController::class, 'register');
$router->add('POST', '/login', AuthController::class, 'login');
//rota autenticada
$router->add('POST', '/posts', PostController::class, 'create');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$router->dispatch($uri, $method);
