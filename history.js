// Ждем, пока вся страница загрузится
document.addEventListener('DOMContentLoaded', async () => {
    const historyList = document.getElementById('historyList');

    try {
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

         // Перебираем каждую трату и создаем для нее красивую темную карточку
            expenses.forEach(item => {
                const div = document.createElement('div');
                div.className = 'expense-card'; 

                div.innerHTML = `
                    <div class="expense-info">
                        <span class="expense-title">${item.category}</span>
                        <span class="expense-date">🕒 ${item.created_at}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span class="expense-price">${item.price} ₴</span>
                        <button onclick="deleteExpense(${item.id})" class="delete-btn" title="Удалить">🗑️</button>
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

async function deleteExpense(id) {
    if (!confirm('Точно удалить эту запись?')) return;
    
    try {
        // Отправляем запрос на наш новый PHP-скрипт
        const response = await fetch('delete_expense.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (result.success) {
            // Если удалилось успешно - просто перезагружаем страницу, чтобы список обновился
            location.reload();
        } else {
            alert('Ошибка при удалении: ' + result.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось связаться с сервером.');
    }
}