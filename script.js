(() => {
  const year = new Date().getFullYear();
  const footers = document.querySelectorAll('.footer__inner > div:first-child');
  footers.forEach((el) => {
    const text = (el.textContent || '').trim();
    if (text.includes('SysAdmin Comparison')) {
      el.textContent = `© ${year} · SysAdmin Comparison`;
    }
  });

  const quiz = document.querySelector('[data-quiz]');
  const resultWrap = document.getElementById('quizResult');
  const scoreEl = document.getElementById('quizScore');

  if (quiz) {
    quiz.addEventListener('submit', (event) => {
      event.preventDefault();

      const questions = quiz.querySelectorAll('.quiz__q');
      let correct = 0;
      let answered = 0;

      questions.forEach((question) => {
        const name = question.getAttribute('data-q');
        const right = question.getAttribute('data-a');
        const picked = quiz.querySelector(`input[name="${name}"]:checked`);

        if (picked) answered += 1;
        if (picked && picked.value === right) correct += 1;
      });

      const total = questions.length;
      if (resultWrap && scoreEl) {
        resultWrap.hidden = false;
        scoreEl.textContent = `Верно: ${correct} из ${total}. Отвечено: ${answered} из ${total}.`;
        resultWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  const canvas = document.querySelector('canvas[data-scene="constellation"]');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let width = 0;
  let height = 0;
  let animationId = 0;

  const palette = {
    glow: ['rgba(201, 211, 107, 0.16)', 'rgba(135, 155, 91, 0.13)', 'rgba(79, 101, 64, 0.18)'],
    line: 'rgba(218, 227, 168, 0.12)',
    pulse: 'rgba(236, 242, 198, 0.22)',
    dot: 'rgba(224, 232, 179, 0.34)'
  };

  const orbs = Array.from({ length: 5 }, (_, index) => ({
    x: 0.18 + index * 0.18,
    y: 0.22 + (index % 2) * 0.24,
    radius: 0.18 + index * 0.015,
    dx: (Math.random() - 0.5) * 0.0009,
    dy: (Math.random() - 0.5) * 0.0006,
    color: palette.glow[index % palette.glow.length]
  }));

  const pings = Array.from({ length: 8 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 1 + Math.random() * 2,
    alpha: 0.08 + Math.random() * 0.16,
    phase: Math.random() * Math.PI * 2
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width * DPR));
    height = Math.max(1, Math.floor(rect.height * DPR));
    canvas.width = width;
    canvas.height = height;
  }

  function drawGrid(time) {
    const spacing = Math.max(42 * DPR, width / 12);
    context.strokeStyle = palette.line;
    context.lineWidth = 1;

    for (let x = -spacing; x < width + spacing; x += spacing) {
      const offset = Math.sin(time * 0.00035 + x * 0.002) * 10 * DPR;
      context.beginPath();
      context.moveTo(x + offset, 0);
      context.lineTo(x - offset * 0.6, height);
      context.stroke();
    }

    for (let y = -spacing; y < height + spacing; y += spacing) {
      const offset = Math.cos(time * 0.00025 + y * 0.003) * 12 * DPR;
      context.beginPath();
      context.moveTo(0, y + offset);
      context.lineTo(width, y - offset * 0.45);
      context.stroke();
    }
  }

  function drawOrbs() {
    orbs.forEach((orb) => {
      orb.x += orb.dx;
      orb.y += orb.dy;

      if (orb.x < 0.05 || orb.x > 0.95) orb.dx *= -1;
      if (orb.y < 0.08 || orb.y > 0.92) orb.dy *= -1;

      const gradient = context.createRadialGradient(
        orb.x * width,
        orb.y * height,
        0,
        orb.x * width,
        orb.y * height,
        orb.radius * Math.min(width, height)
      );
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(orb.x * width, orb.y * height, orb.radius * Math.min(width, height), 0, Math.PI * 2);
      context.fill();
    });
  }

  function drawContours(time) {
    const rows = 6;
    for (let row = 0; row < rows; row += 1) {
      const yBase = height * (0.18 + row * 0.12);
      context.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const y = yBase + Math.sin(x * 0.012 + time * 0.0012 + row) * (8 + row * 1.8) * DPR;
        if (x === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.strokeStyle = `rgba(217, 227, 172, ${0.04 + row * 0.012})`;
      context.lineWidth = 1.1 * DPR;
      context.stroke();
    }
  }

  function drawPings(time) {
    pings.forEach((ping, index) => {
      const pulse = (Math.sin(time * 0.0016 + ping.phase + index) + 1) / 2;
      const x = ping.x * width;
      const y = ping.y * height;

      context.fillStyle = palette.dot;
      context.beginPath();
      context.arc(x, y, ping.size * DPR, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = palette.pulse;
      context.lineWidth = DPR;
      context.beginPath();
      context.arc(x, y, (8 + pulse * 18) * DPR, 0, Math.PI * 2);
      context.stroke();
    });
  }

  function render(time) {
    context.clearRect(0, 0, width, height);

    context.fillStyle = 'rgba(10, 13, 9, 0.12)';
    context.fillRect(0, 0, width, height);

    drawOrbs();
    drawGrid(time);
    drawContours(time);
    drawPings(time);

    animationId = window.requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  animationId = window.requestAnimationFrame(render);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationId);
    } else {
      animationId = window.requestAnimationFrame(render);
    }
  });
})();
