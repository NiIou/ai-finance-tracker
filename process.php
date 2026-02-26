<?php
require_once 'db.php';
header('Content-Type: application/json');

// Получаем данные от фронтенда
$rawData = file_get_contents("php://input");
$request = json_decode($rawData, true);

if (!isset($request['text']) || empty(trim($request['text']))) {
    echo json_encode(['error' => 'No text provided']);
    exit;
}

$userText = $request['text'];

// --- НАСТРОЙКИ API ---
// ВСТАВЬ СВОЙ КЛЮЧ СЮДА:
$apiKey = 'API'; 

// Используем быструю модель Gemini 1.5 Flash
$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey;

// Формируем жесткий промпт, чтобы ИИ отдавал ТОЛЬКО чистый JSON
$systemPrompt = "You are a smart financial assistant. Analyze the user's input about expenses. 
Return strictly a JSON object with TWO keys: 'items' and 'total_sum'. 
'items' should be an array of objects, where each object has 'category' (string, with a suitable emoji, e.g., '🛒 Groceries') and 'price' (number). 
'total_sum' should be the total number of all prices combined.
Calculate the totals correctly based on the input (e.g. '2 sausages for 10' means price is 20).
Do not add any explanations, markdown formatting, or text outside the JSON.
User input: ";

$data = [
    "contents" => [
        [
            "parts" => [
                ["text" => $systemPrompt . $userText]
            ]
        ]
    ]
];

// Отправляем запрос через cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Важно для локалки (Laragon)

$response = curl_exec($ch);

if(curl_errno($ch)){
    echo json_encode(['error' => 'Server curl error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

$responseData = json_decode($response, true);

// Проверяем, есть ли нужный ответ от ИИ
if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
    $aiText = $responseData['candidates'][0]['content']['parts'][0]['text'];
    
    // Очищаем ответ от возможных markdown-тегов (```json ... ```), если ИИ их добавит
    $aiText = preg_replace('/```json/i', '', $aiText);
    $aiText = preg_replace('/```/i', '', $aiText);
    $aiText = trim($aiText);

    // --- НАЧАЛО СОХРАНЕНИЯ В БАЗУ ---
    $aiData = json_decode($aiText, true);

    if (isset($aiData['items']) && is_array($aiData['items'])) {
        $stmt = $pdo->prepare("INSERT INTO expenses (category, price, created_at) VALUES (:category, :price, NOW())");
        foreach ($aiData['items'] as $item) {
            $stmt->execute([
                'category' => $item['category'],
                'price' => $item['price'] 
            ]);
        }
    }
    // --- КОНЕЦ СОХРАНЕНИЯ В БАЗУ ---

    // Отправляем чистый JSON обратно в браузер
    echo $aiText;
} else {
    echo json_encode(['error' => 'Invalid response from AI', 'details' => $responseData]);
}
?>