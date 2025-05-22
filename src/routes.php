<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/controllers/AuthController.php';


$db = Database::connect();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$authController = new AuthController($db);

if ($uri === '/register' && $method === 'POST') {
    $authController->register();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Rota não encontrada.']);
}
