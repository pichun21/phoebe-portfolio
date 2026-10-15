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
  document.querySelectorAll('.recent-card').forEach(c => c.classList.toggle('is-real', on));
}));

// 首頁書桌：點咖啡杯多冒一陣熱氣、點素描本裡的妞妞會「汪！」
const deskFx = document.querySelector('.desk-fx');
if (deskFx) {
  let woofTimer;
  document.querySelector('.hit-cup')?.addEventListener('click', () => {
    deskFx.classList.remove('puff'); void deskFx.getBoundingClientRect();
    deskFx.classList.add('puff');
    setTimeout(() => deskFx.classList.remove('puff'), 3600);
  });
  document.querySelector('.hit-dog')?.addEventListener('click', () => {
    deskFx.classList.remove('woof'); void deskFx.getBoundingClientRect();
    deskFx.classList.add('woof');
    clearTimeout(woofTimer);
    woofTimer = setTimeout(() => deskFx.classList.remove('woof'), 1800);
  });
}

// 鬱金香：游標碰到或點一下就搖一搖
const tulips = document.querySelector('.hero-tulips');
const hitTulip = document.querySelector('.hit-tulip');
if (tulips && hitTulip) {
  const sway = () => {
    if (tulips.classList.contains('sway')) return;
    tulips.classList.add('sway');
    tulips.addEventListener('animationend', () => tulips.classList.remove('sway'), { once: true });
  };
  hitTulip.addEventListener('mouseenter', sway);
  hitTulip.addEventListener('click', sway);
}
