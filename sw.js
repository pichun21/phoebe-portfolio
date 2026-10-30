/* 頁間日子：離線開啟用。網頁本身採「先連網、失敗才用快取」，所以更新網站後一定拿到新版。 */
const VERSION='pages-between-days-v87';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
const RUNTIME_HOSTS=['fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  // 書房的網頁：先連網，離線時用上次存下的版本
  if(req.mode==='navigate'||(url.origin===location.origin&&/\/(index\.html)?$/.test(url.pathname))){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('./index.html',cp));return r}).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
    return;
  }
  // 集郵冊的郵票圖：第一次看到時存起來，之後離線也能看
  if(url.origin===location.origin&&/\/stamps\//.test(url.pathname)){e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(req);if(hit)return hit;const r=await fetch(req);if(r.ok)c.put(req,r.clone());return r}));return}
  // 圖示、設定檔：快取優先
  if(url.origin===location.origin){e.respondWith(caches.match(req).then(r=>r||fetch(req)));return}
  // 字型與 Excel 元件：先給快取，背景更新
  if(RUNTIME_HOSTS.includes(url.hostname)){
    e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(req);const net=fetch(req).then(r=>{if(r.ok||r.type==='opaque')c.put(req,r.clone());return r}).catch(()=>hit);return hit||net}));
  }
  // 其他（GitHub 同步、博客來）一律直接連網，不快取
});
