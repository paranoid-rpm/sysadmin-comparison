(() => {
  const year = new Date().getFullYear();
  const footers = document.querySelectorAll('.footer__inner > div:first-child');
  footers.forEach(el => {
    if (el.textContent.includes('©')) {
      el.textContent = `© ${year} · SysAdmin Comparison`;
    }
  });

  const quiz = document.querySelector('[data-quiz]');
  const resultWrap = document.getElementById('quizResult');
  const scoreEl = document.getElementById('quizScore');

  if (quiz) {
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
      if (resultWrap && scoreEl) {
        resultWrap.hidden = false;
        scoreEl.textContent = `Верно: ${correct} из ${total}. Отвечено: ${answered} из ${total}.`;
        resultWrap.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  }

  const canvas = document.querySelector('canvas[data-scene="constellation"]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize(){
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.floor(r.width * DPR);
    canvas.height = Math.floor(r.height * DPR);
  }
  resize();
  window.addEventListener('resize', resize, {passive:true});

  const W = () => canvas.width;
  const H = () => canvas.height;

  const N = 42;
  const pts = Array.from({length:N}, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00035,
    vy: (Math.random() - 0.5) * 0.00035,
  }));

  function step(){
    const w = W(), h = H();
    ctx.clearRect(0,0,w,h);

    ctx.fillStyle = 'rgba(255,255,255,.04)';
    ctx.fillRect(0,0,w,h);

    const ax = 122, ay = 162, az = 214; // --accent
    const bx = 159, by = 184, bz = 170; // --accent2

    for (const p of pts){
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
    }

    for (let i=0;i<pts.length;i++){
      const a = pts[i];
      const axp = a.x*w, ayp = a.y*h;
      for (let j=i+1;j<pts.length;j++){
        const b = pts[j];
        const bxp = b.x*w, byp = b.y*h;
        const dx = axp - bxp;
        const dy = ayp - byp;
        const d = Math.sqrt(dx*dx + dy*dy);
        const max = Math.min(w,h) * 0.22;
        if (d < max){
          const t = 1 - d/max;
          const r = Math.floor(ax*(0.65) + bx*(0.35));
          const g = Math.floor(ay*(0.65) + by*(0.35));
          const bcol = Math.floor(az*(0.65) + bz*(0.35));
          ctx.strokeStyle = `rgba(${r},${g},${bcol},${0.12*t})`;
          ctx.lineWidth = Math.max(1, 1.2*DPR);
          ctx.beginPath();
          ctx.moveTo(axp, ayp);
          ctx.lineTo(bxp, byp);
          ctx.stroke();
        }
      }
    }

    for (const p of pts){
      const x = p.x*w, y = p.y*h;
      ctx.fillStyle = 'rgba(122,162,214,.35)';
      ctx.beginPath();
      ctx.arc(x, y, 1.4*DPR, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();
