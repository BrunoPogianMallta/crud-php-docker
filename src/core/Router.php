<?php

class Router
{
    private $routes = [];
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function add($method, $path, $controller, $action)
    {
        $this->routes[] = compact('method', 'path', 'controller', 'action');
    }

    public function dispatch($requestUri, $requestMethod)
    {
        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && $route['path'] === $requestUri) {
                $controller = new $route['controller']($this->db);
                return $controller->{$route['action']}();
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Rota não encontrada.']);
    }
}
