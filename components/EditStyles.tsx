import { editStylesCss } from "@/lib/edit/styles";

/** Admin paneldan sozlangan shrift o'lchamlari (lib/edit/styles.ts); qoida bo'lmasa hech narsa chizilmaydi */
export function EditStyles({ path }: { path: string }) {
  const css = editStylesCss(path);
  // dangerouslySetInnerHTML: selektordagi ">" HTML sifatida qochirilmasin (qiymatlar lib/edit/styles.ts da tekshirilgan)
  return css ? <style data-oh-styles="" dangerouslySetInnerHTML={{ __html: css }} /> : null;
}
