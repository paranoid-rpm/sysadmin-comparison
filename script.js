(() => {
  const year = new Date().getFullYear();
  const footers = document.querySelectorAll('.footer__inner > div:first-child');
  footers.forEach(el => {
    if (el.textContent.includes('©')) {
      el.textContent = `© ${year} · SysAdmin Comparison`;
    }
  });

  const quiz = document.querySelector('[data-quiz]');
  if (!quiz) return;

  const resultWrap = document.getElementById('quizResult');
  const scoreEl = document.getElementById('quizScore');

  quiz.addEventListener('submit', (e) => {
    e.preventDefault();

    const questions = quiz.querySelectorAll('.quiz__q');
    let correct = 0;
    let answered = 0;

    questions.forEach(q => {
      const name = q.getAttribute('data-q');
      const right = q.getAttribute('data-a');
      const picked = quiz.querySelector(`input[name="${name}"]:checked`);
      if (picked) answered += 1;
      if (picked && picked.value === right) correct += 1;
    });

    const total = questions.length;
    resultWrap.hidden = false;
    scoreEl.textContent = `Верно: ${correct} из ${total}. Отвечено: ${answered} из ${total}.`;
    resultWrap.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();
