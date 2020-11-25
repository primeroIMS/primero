import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";
import enLocale from "date-fns/locale/en-US";
import compact from "lodash/compact";

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

export default localize;
