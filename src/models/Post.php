<?php

class Post {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($title, $content, $userId) {
        $stmt = $this->conn->prepare("INSERT INTO posts (title, content, user_id) VALUES (:title, :content, :user_id)");
        return $stmt->execute([
            ':title' => $title,
            ':content' => $content,
            ':user_id' => $userId
        ]);
    }
}
