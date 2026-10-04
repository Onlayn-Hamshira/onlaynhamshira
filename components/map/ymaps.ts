// Yandex Maps JS API 2.1 yuklovchisi. ContactMap uni MapView chunk'i bilan parallel chaqiradi —
// skript chunk yuklanishini kutmaydi.
// Kalit (NEXT_PUBLIC_YANDEX_MAPS_KEY) bo'lsa — vektor xarita.
export const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY;

/* eslint-disable @typescript-eslint/no-explicit-any -- ymaps rasmiy tiplarga ega emas */
export type YMaps = any;
let loader: Promise<YMaps> | null = null;

export function loadYmaps(lang: string): Promise<YMaps> {
  const w = window as any;
  if (w.ymaps?.Map) return Promise.resolve(w.ymaps);
  loader ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://api-maps.yandex.ru/2.1/?lang=${lang}${API_KEY ? `&apikey=${API_KEY}` : ""}`;
    s.async = true;
    s.onload = () => w.ymaps.ready(() => resolve(w.ymaps));
    s.onerror = () => {
      loader = null;
      reject(new Error("ymaps"));
    };
    document.head.appendChild(s);
  });
  return loader;
}

/** DNS/TLS'ni oldindan tayyorlash (cookie yo'q) — foydalanuvchi harakatidan keyin chaqiriladi */
export function preconnectYmaps() {
  for (const href of ["https://api-maps.yandex.ru", "https://yastatic.net", "https://core-renderer-tiles.maps.yandex.net"]) {
    if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) continue;
    const l = document.createElement("link");
    l.rel = "preconnect";
    l.href = href;
    l.crossOrigin = "";
    document.head.appendChild(l);
  }
}
