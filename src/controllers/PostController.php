<?php

require_once __DIR__ . '/../models/Post.php';
require_once __DIR__ . '/../core/AuthMiddleware.php';


class PostController {
    private $db;
    private $auth;

    public function __construct($db) {
        $this->db = $db;
        $this->auth = new AuthMiddleware();
    }

    public function create() {
        $user = $this->auth->verifyToken();

        $input = json_decode(file_get_contents('php://input'), true);
        $title = $input['title'] ?? '';
        $content = $input['content'] ?? '';

        if (!$title || !$content) {
            http_response_code(400);
            echo json_encode(['error' => 'Título e conteúdo são obrigatórios.']);
            return;
        }

        $postModel = new Post($this->db);
        if ($postModel->create($title, $content, $user->id)) {
            echo json_encode(['success' => 'Post criado com sucesso!']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar post.']);
        }
    }
}
