import { LOCALES, LOCALE_NAMES, localePath, type Locale } from "@/lib/i18n/config";

/**
 * Til almashtirgich: oddiy havolalar (JS'siz ishlaydi). Har bir til — alohida statik sahifa,
 * shuning uchun almashtirish to'liq yangi HTML yuklaydi: <html lang>, shrift va metadata to'g'ri bo'ladi.
 * hrefs — sahifaning boshqa tillardagi rasmiy manzillari (lib/nav → pageAlternates); bo'lmasa bosh sahifa.
 * Ko'rinadigan matn "UZ", ekran o'quvchi uchun to'liq nom — o'sha tilning talaffuzi bilan (lang).
 */
export function LangSwitch({
  lang, label, hrefs, className = "",
}: { lang: Locale; label: string; hrefs?: Record<Locale, string>; className?: string }) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center rounded-full bg-mist p-1 ring-1 ring-line">
        {LOCALES.map((l) => {
          const on = l === lang;
          return (
            <li key={l}>
              <a
                href={hrefs?.[l] ?? localePath(l)}
                hrefLang={l}
                lang={l}
                aria-current={on ? "true" : undefined}
                className={`grid h-8 min-w-8 place-items-center rounded-full px-1.5 text-[13px] font-semibold uppercase transition sm:min-w-9 ${
                  on ? "bg-white text-ink shadow-[0_2px_8px_-3px_rgb(13_47_68/0.35)]" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span aria-hidden>{l}</span>
                {/* Tizim shrifti: ko'rinmaydigan "Русский" yozuvi uz/en sahifalarda Onest'ning kirill faylini (16KB) yuklatmasin */}
                <span className="sr-only font-[system-ui]">{`${l.toUpperCase()} — ${LOCALE_NAMES[l]}`}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
