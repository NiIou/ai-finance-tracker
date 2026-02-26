<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
    // Делаем запрос: ДОСТАНЬ ВСЁ из таблицы expenses и ОТСОРТИРУЙ по дате создания (DESC - от новых к старым)
    $stmt = $pdo->query("SELECT * FROM expenses ORDER BY created_at DESC");
    
    // Превращаем ответ базы в удобный массив PHP
    $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Отдаем массив браузеру
    echo json_encode(['success' => true, 'data' => $expenses]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Ошибка чтения БД: ' . $e->getMessage()]);
}
?>