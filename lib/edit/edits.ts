// Admin paneldan almashtirilgan rasmlar (content/edits/images.json). Client komponentlar ham import qiladi,
// shuning uchun bu yerda faqat kichik rasm xaritasi — matnlar (text.json) faqat serverda (lib/edit/text.ts).

import raw from "@/content/edits/images.json";

export const EDITED_IMAGES = raw as Record<string, string>;

/**
 * Admin paneldan almashtirsa bo'ladigan rasmlar (yo'l prefiksi bo'yicha). Shu rasmlar komponentlarda
 * editableImage() orqali o'tishi shart — aks holda yangi rasm saytga chiqmaydi.
 */
export const EDITABLE_IMAGE_PREFIXES = ["/img/", "/services/", "/badges/", "/legacy/", "/logo-v2.svg"];

/** Rasm yo'li → admin almashtirgan rasm (bo'lmasa o'zi) */
export const editableImage = (src: string) => EDITED_IMAGES[src] ?? src;
