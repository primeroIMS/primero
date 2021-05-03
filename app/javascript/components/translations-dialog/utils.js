import { LOCALE_KEYS } from "../../config";

export const localesToRender = locales => locales.filter(locale => locale.id !== LOCALE_KEYS.en);

export const buildLocaleFields = locales =>
  locales.flatMap(locale => [`name.${locale.id}`, `description.${locale.id}`]);
