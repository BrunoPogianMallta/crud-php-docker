<?php

require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function register() {
        $input = json_decode(file_get_contents('php://input'), true);

        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (!$name || !$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Todos os campos são obrigatórios.']);
            return;
        }

        $userModel = new User($this->db);

        if ($userModel->findByEmail($email)) {
            http_response_code(409);
            echo json_encode(['error' => 'Email já cadastrado.']);
            return;
        }

        if ($userModel->create($name, $email, $password)) {
            echo json_encode(['success' => 'Usuário cadastrado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao cadastrar usuário.']);
        }
    }
}
