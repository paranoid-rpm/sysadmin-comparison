document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    
    if(submitBtn) {
        submitBtn.addEventListener('click', () => {
            let score = 0;
            const totalQuestions = 4;
            
            // Correct answers
            const answers = {
                q1: 'b',
                q2: 'c',
                q3: 'a',
                q4: 'b'
            };

            const q1 = document.querySelector('input[name="q1"]:checked');
            const q2 = document.querySelector('input[name="q2"]:checked');
            const q3 = document.querySelector('input[name="q3"]:checked');
            const q4 = document.querySelector('input[name="q4"]:checked');

            if (!q1 || !q2 || !q3 || !q4) {
                alert('Пожалуйста, ответьте на все вопросы перед проверкой!');
                return;
            }

            if (q1.value === answers.q1) score++;
            if (q2.value === answers.q2) score++;
            if (q3.value === answers.q3) score++;
            if (q4.value === answers.q4) score++;

            const resultBox = document.getElementById('result');
            resultBox.classList.remove('hidden');

            if (score === totalQuestions) {
                resultBox.className = 'result-box success';
                resultBox.innerHTML = '🔥 Идеально! Вы ответили правильно на все вопросы (' + score + '/' + totalQuestions + '). Материал усвоен на 100%.';
            } else if (score >= 2) {
                resultBox.className = 'result-box success';
                resultBox.innerHTML = '👍 Хороший результат! Вы ответили на ' + score + ' из ' + totalQuestions + ' вопросов. Есть куда расти.';
            } else {
                resultBox.className = 'result-box fail';
                resultBox.innerHTML = '⚠️ Ваш результат: ' + score + ' из ' + totalQuestions + '. Рекомендуем внимательно перечитать разделы сайта.';
            }

            // Scroll to result
            resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
});