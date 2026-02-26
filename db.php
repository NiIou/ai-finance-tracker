<?php
$host = 'localhost';
$dbname = 'finance_db';
$user = 'root';
$pass = '';

try {
    // Подключение к базе данных
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    
    // Включаем режим строгих ошибок (чтобы база сразу кричала, если мы напишем плохой запрос)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    die("Ошибка подключения к складу (БД): " . $e->getMessage());
}