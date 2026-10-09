import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV2";
import PropTypes from "prop-types";
import { useMemo } from "react";

import localize, { dateFnsLocales } from "./libs/date-picker-localization";
import { useI18n } from "./components/i18n";

const buildLocaleText = i18n => ({
  fieldYearPlaceholder: params => "y".repeat(params.digitAmount),
  fieldMonthPlaceholder: params => (params.contentType === "letter" ? "mmm" : "mm"),
  fieldDayPlaceholder: () => "dd",
  clearButtonLabel: i18n.t("buttons.clear"),
  okButtonLabel: i18n.t("buttons.ok")
});

function DateProvider({ children, excludeAdpaterLocale = false }) {
  const i18n = useI18n();
  // Memoized on locale: a new adapterLocale/localeText object on every render makes MUI rebuild its date
  // adapter each keystroke, which it treats as a locale change and resets in-progress field sections.
  const adapterLocale = useMemo(
    () => (excludeAdpaterLocale ? null : localize(i18n)),
    [excludeAdpaterLocale, i18n.locale]
  );
  const localeText = useMemo(() => buildLocaleText(i18n), [i18n.locale]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      localeText={localeText}
      adapterLocale={dateFnsLocales[i18n.locale] ?? adapterLocale}
    >
      {children}
    </LocalizationProvider>
  );
}

DateProvider.displayName = "DateProvider";

DateProvider.propTypes = {
  children: PropTypes.node,
  excludeAdpaterLocale: PropTypes.bool
};

export default DateProvider;
