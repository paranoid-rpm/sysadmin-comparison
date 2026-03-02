(() => {
  // Минимальный JS на этапе «скелета»: можно расширять дальше.
  // Оставлено намеренно: сайт информационный, без «лишней» динамики.
  const year = new Date().getFullYear();
  const footers = document.querySelectorAll('.footer__inner > div:first-child');
  footers.forEach(el => {
    if (el.textContent.includes('©')) {
      el.textContent = `© ${year} · SysAdmin Comparison`;
    }
  });
})();
