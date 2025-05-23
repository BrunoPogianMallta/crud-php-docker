<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/controllers/PostController.php';

$db = Database::connect();
$router = new Router($db);


$router->add('POST', '/register', AuthController::class, 'register');
$router->add('POST', '/login', AuthController::class, 'login');

// Rotas autenticadas para posts
$router->add('POST', '/posts', PostController::class, 'create');           // cria o post
$router->add('GET', '/posts', PostController::class, 'listAll');             // lista todos posts posts
$router->add('GET', '/posts/{id}', PostController::class, 'getById');         // ver post pelo id
$router->add('PUT', '/posts/{id}', PostController::class, 'update');       // atualizar o  post
$router->add('DELETE', '/posts/{id}', PostController::class, 'delete');    // deletar 0 post

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$router->dispatch($uri, $method);
