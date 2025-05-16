import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PropTypes from "prop-types";

import localize from "./libs/date-picker-localization";
import { useI18n } from "./components/i18n";

const localeText = i18n => ({
  fieldYearPlaceholder: params => "y".repeat(params.digitAmount),
  fieldMonthPlaceholder: params => (params.contentType === "letter" ? "mmm" : "mm"),
  fieldDayPlaceholder: () => "dd",
  clearButtonLabel: i18n.t("buttons.clear"),
  okButtonLabel: i18n.t("buttons.ok")
});

function DateProvider({ children, excludeAdpaterLocale = false }) {
  const i18n = useI18n();
  const adapterLocale = excludeAdpaterLocale ? null : localize(i18n);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={localeText(i18n)} adapterLocale={adapterLocale}>
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
