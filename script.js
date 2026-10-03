const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
btn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Subtle active navigation state while scrolling.
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .25, .5] });
sections.forEach(section => observer.observe(section));

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
