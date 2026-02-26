<?php
require_once 'db.php';
header('Content-Type: application/json');

// Получаем ID, который пришлет нам JavaScript
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'ID не передан']);
    exit;
}

try {
    // Подготавливаем безопасный запрос на удаление
    $stmt = $pdo->prepare("DELETE FROM expenses WHERE id = :id");
    $stmt->execute(['id' => $data['id']]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Ошибка удаления: ' . $e->getMessage()]);
}
?>