<?php
require_once 'config/database.php';
require_once __DIR__ . '/routes.php';

$db = Database::connect();
echo "Conexão com o banco de dados funcionando!";
