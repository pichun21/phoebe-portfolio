const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
btn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// LINE 主題縮圖：先用 assets/line-theme.png；沒有的話到 LINE 圖片伺服器依版本號尋找，全部失敗就移除縮圖框。
document.querySelectorAll('img[data-line-theme]').forEach(img => {
  const id = img.dataset.lineTheme;
  const base = `https://shop.line-scdn.net/themeshop/v1/products/${id.slice(0,2)}/${id.slice(2,4)}/${id}`;
  let v = 0;
  const tryNext = () => {
    v++;
    if (v > 40) { img.parentElement?.remove(); return; }
    img.src = `${base}/${v}/WEBSTORE/icon_198x278.png`;
  };
  img.addEventListener('error', tryNext);
  if (img.complete && img.naturalWidth === 0) tryNext();
});

// 手機等沒有游標的裝置：最近更新的卡片滑到畫面中間時，自動從線稿變成實際畫面。
if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('is-real', e.isIntersecting));
  }, { threshold: 0.75 });
  document.querySelectorAll('.recent-card').forEach(c => io.observe(c));
}

// 首頁吊燈：點燈罩開關燈
document.querySelectorAll('.lamp-switch').forEach(sw => sw.addEventListener('click', () => {
  const wrap = sw.closest('.hero-art-wrap');
  const on = wrap.classList.toggle('is-on');
  sw.setAttribute('aria-pressed', String(on));
  sw.setAttribute('aria-label', on ? '關燈' : '開燈');
}));
