<?php
$host = 'localhost';
$dbname = 'finance_db';
$user = 'root';
$pass = '';

try {
    // 1. Создаем мост (подключение) к базе данных
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    
    // 2. Включаем режим строгих ошибок (чтобы база сразу кричала, если мы напишем плохой запрос)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    // 3. Если база выключена в Laragon или пароль неверный - убиваем скрипт
    die("Ошибка подключения к складу (БД): " . $e->getMessage());
}