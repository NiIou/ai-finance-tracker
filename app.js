const form = document.getElementById('expense-form');
const button = document.getElementById('submit-btn');
const input = document.getElementById('expense-input');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const categories_list = document.getElementById('categories-list');

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const text = input.value.trim();

    if (!text) {
        return;
    }

    // Подготовка интерфейса
    button.disabled = true;
    loading.classList.remove('hidden');
    results.classList.add('hidden');
    categories_list.innerHTML = '';

    try {
        const response = await fetch('process.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({text: text}),
        });
        
        // Получаем и парсим ответ
        const data = await response.json();
        
        // Защита: если сервер вернул свою ошибку
        if (data.error) {
            alert("Ошибка сервера: " + data.error);
            return;
        }

        // Отрисовка списка трат
        data.items.forEach(item => {
            const li = document.createElement('li');
            // Немного базовых стилей, чтобы список выглядел опрятно (если используешь Tailwind)
            li.className = 'flex justify-between p-3 bg-gray-50 rounded border-l-4 border-blue-500 mb-2 shadow-sm';
            li.innerHTML = `<span>${item.category}</span> <span class="font-bold">${item.price} ₴</span>`;
            categories_list.appendChild(li);
        });

        // Отрисовка общей суммы (предполагаю, что в HTML есть тег с id="total-sum")
        const totalSumElement = document.getElementById('total-sum');
        if (totalSumElement) {
            totalSumElement.textContent = data.total_sum + ' ₴';
        }

        // Показываем блок с результатами
        results.classList.remove('hidden');

    } catch (error) {
        console.error("Критическая ошибка:", error);
        alert("Произошла ошибка связи с сервером. Проверь консоль (F12).");
    } finally {
        // Возвращаем интерфейс в исходное состояние
        button.disabled = false;
        loading.classList.add('hidden');
    }
});