import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";
import enLocale from "date-fns/locale/en-US";
import compact from "lodash/compact";
import {
  ar,
  arTN,
  bn,
  enUS,
  es,
  fr,
  hi,
  hu,
  hy,
  id,
  it,
  km,
  faIR,
  tr,
  mn,
  pl,
  pt,
  ptBR,
  ro,
  ru,
  sk,
  th,
  uk,
  zhCN
} from "date-fns/locale";

import { DATE_FORMAT, DATE_FORMAT_FALLBACK, DATE_TIME_FORMAT, DATE_TIME_FORMAT_FALLBACK } from "../config";

const monthValues = i18n => ({
  narrow: ["e", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: compact(i18n.t("date.abbr_month_names")),
  wide: compact(i18n.t("date.abbr_month_names"))
});

const dayValues = i18n => ({
  narrow: ["d", "l", "m", "m", "j", "v", "s"],
  short: compact(i18n.t("date.abbr_day_names_short")),
  abbreviated: compact(i18n.t("date.abbr_day_names")),
  wide: compact(i18n.t("date.day_names"))
});

const localize = i18n => ({
  ...enLocale,
  localize: {
    ...enLocale.localize,
    month: buildLocalizeFn({
      values: monthValues(i18n),
      defaultWidth: "wide"
    }),
    day: buildLocalizeFn({
      values: dayValues(i18n),
      defaultWidth: "wide"
    })
  }
});

function dayOfWeekFormatter(i18n) {
  return date => {
    return i18n.t(`date.abbr_day_names_short.${date.getDay()}`);
  };
}

const dateFnsLocales = {
  ar,
  "ar-IQ": ar,
  "ar-JO": ar,
  "ar-LB": ar,
  "ar-SD": ar,
  aeb: arTN,
  "ar-SY": ar,
  bn,
  cmn: zhCN,
  en: enUS,
  es,
  "es-GT": es,
  "es-ES": es,
  fr,
  "hi-IN": hi,
  hu,
  hy,
  id,
  it,
  km,
  "fa-AF": faIR,
  "ps-AF": faIR,
  tr,
  mn,
  pl,
  pt,
  "pt-AO": pt,
  "pt-BR": ptBR,
  "pt-MZ": pt,
  ro,
  ru,
  sk,
  th,
  uk,
  zh: zhCN
};

const resolvedDateFnsLocales = Object.freeze(Object.keys(dateFnsLocales));

function selectedDateFormat(includeTime, locale) {
  const localeResolved = resolvedDateFnsLocales.includes(locale);

  if (includeTime) {
    return localeResolved ? DATE_TIME_FORMAT : DATE_TIME_FORMAT_FALLBACK;
  }

  return localeResolved ? DATE_FORMAT : DATE_FORMAT_FALLBACK;
}

export default localize;

export { dayOfWeekFormatter, dateFnsLocales, resolvedDateFnsLocales, selectedDateFormat };
