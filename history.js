// Ждем, пока вся страница загрузится
document.addEventListener('DOMContentLoaded', async () => {
    const historyList = document.getElementById('historyList');

    try {
        // Стучимся к нашему PHP-грузчику
        const response = await fetch('get_expenses.php');
        const result = await response.json();

        if (result.success) {
            const expenses = result.data;

            // Если база пустая
            if (expenses.length === 0) {
                historyList.innerHTML = '<p class="text-gray-500 text-center">История пуста. Пора что-нибудь купить! 💸</p>';
                return;
            }

            // Очищаем надпись "Загрузка..."
            historyList.innerHTML = '';

            // Перебираем каждую трату из базы и создаем для нее красивую карточку
            expenses.forEach(item => {
                const div = document.createElement('div');
                div.className = 'flex justify-between items-center bg-gray-50 p-4 rounded-lg border shadow-sm mb-2';

                div.innerHTML = `
                    <div>
                        <span class="font-bold text-lg">${item.category}</span>
                        <span class="text-xs text-gray-500 block mt-1">🕒 ${item.created_at}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="font-bold text-xl">${item.price} ₴</span>
                        <button onclick="deleteExpense(${item.id})" class="text-red-500 hover:text-red-700 transition-colors" title="Удалить">
                            🗑️
                        </button>
                    </div>
                `;
                historyList.appendChild(div);
            });
        } else {
            historyList.innerHTML = `<p class="text-red-500">Ошибка: ${result.error}</p>`;
        }
    } catch (error) {
        console.error('Ошибка загрузки истории:', error);
        historyList.innerHTML = '<p class="text-red-500">Не удалось связаться с сервером.</p>';
    }
});

// Функция удаления (пока это просто болванка, PHP для нее мы напишем следом)
async function deleteExpense(id) {
    if (!confirm('Точно удалить эту запись?')) return;
    
    // Пока просто выводим сообщение, чтобы проверить, что кнопка работает и ловит правильный ID
    alert('Кнопка работает! Мы пытаемся удалить запись с ID: ' + id + '. Сейчас напишем для этого PHP-скрипт!');
}