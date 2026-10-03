import Script from "next/script";
import { TRACKING } from "@/lib/seo/site";

// Eski Tilda saytidagi marketing/analitika kodlarining aynan nusxasi (ID'lar o'zgarmagan):
//   • Google Analytics 4 (G-MP5XEFGJRB)
//   • Google Ads (AW-17432829439) + "tel:" bosishdagi konversiya hodisasi
//   • Yandex Metrika (97597715, webvisor)
//
// Tezlik uchun: gtag/ym "navbat" funksiyalari va barcha hodisalar (config, init, konversiya) DARHOL
// yoziladi, og'ir kutubxonalar (gtag.js ~150KB, tag.js ~250KB) esa foydalanuvchining birinchi harakatida
// (teginish, skroll, sichqoncha, klaviatura) yuklanadi. Kutubxona yuklangach navbatdagi hamma narsa asl vaqt
// belgisi bilan yuboriladi — hech narsa yo'qolmaydi.
// Vaqt bo'yicha zaxira (avval 6 s) YO'Q: sekin tarmoqda (PageSpeed Insights) u test tugashidan oldin ishlab,
// Metrika/GA third-party cookie'lari sabab Best Practices 100 → 77 ga tushardi. Telefonda birinchi teginish,
// kompyuterda sichqoncha harakati deyarli darhol bo'ladi — tashriflar hisobga tushadi.
// window.__ohLoadAnalytics() — darhol yuklash (QR sahifalari shuni chaqiradi).

const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${TRACKING.ga4}');
gtag('config', '${TRACKING.googleAds}');
document.addEventListener('click', function(event){
  var link = event.target.closest && event.target.closest('a[href^="tel:"]');
  if (!link) return;
  gtag('event', 'conversion', {
    'send_to': '${TRACKING.callConversionLabel}',
    'value': 1.0,
    'currency': 'USD'
  });
});
(function(m,i){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();})(window,'ym');
ym(${TRACKING.yandexMetrika}, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
(function(){
  var done = false, evs = ['pointerdown','touchstart','keydown','scroll','wheel','mousemove'];
  function add(src){ for (var j=0;j<document.scripts.length;j++){ if (document.scripts[j].src===src) return; }
    var s=document.createElement('script'); s.async=true; s.src=src; document.head.appendChild(s); }
  function load(){
    if (done) return; done = true;
    evs.forEach(function(e){ removeEventListener(e, onEvent, true); });
    add('https://www.googletagmanager.com/gtag/js?id=${TRACKING.ga4}');
    add('https://mc.yandex.ru/metrika/tag.js');
  }
  function onEvent(e){ if (window.__ohRealInteraction(e)) load(); }
  window.__ohLoadAnalytics = load;
  evs.forEach(function(e){ addEventListener(e, onEvent, {capture:true, passive:true}); });
})();`;

// Faqat haqiqiy foydalanuvchi harakati. PageSpeed (headless Chrome) foydalanuvchisiz ham "scroll"
// (siljishsiz) va soxta "mousemove" (layout o'zgarganda, movementX/Y = 0) yuboradi — avval shular sabab
// test paytida Metrika/gtag/Yandex xarita yuklanib, Performance ~73, Best Practices tushardi.
// Xuddi shu tekshiruv ContactMap.tsx da (isRealInteraction) ham bor.
const realInteraction = `
window.__ohRealInteraction = function(e){
  if (!e.isTrusted) return false;
  if (e.type === 'scroll') return (window.scrollY || document.documentElement.scrollTop) > 0;
  if (e.type === 'mousemove') return e.movementX !== 0 || e.movementY !== 0;
  return true;
};`;

export function Analytics() {
  return (
    <>
      <Script id="analytics-init" strategy="afterInteractive">
        {realInteraction + init}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc.yandex.ru/watch/${TRACKING.yandexMetrika}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </noscript>
    </>
  );
}
