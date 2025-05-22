<?php
require_once 'config/database.php';

$db = Database::connect();
echo "Conexão com o banco de dados funcionando!";
