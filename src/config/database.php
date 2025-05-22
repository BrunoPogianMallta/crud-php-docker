<?php
class Database {
    public static function connect() {
        try {
            $host = 'db'; 
            $dbname = 'blog';
            $user = 'user';
            $pass = 'secret';

            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $pdo;
        } catch (PDOException $e) {
            die("Erro ao conectar ao banco de dados: " . $e->getMessage());
        }
    }
}
