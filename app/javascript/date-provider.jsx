import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PropTypes from "prop-types";

import localize from "./libs/date-picker-localization";
import { useI18n } from "./components/i18n";

const localeText = {
  fieldYearPlaceholder: params => "y".repeat(params.digitAmount),
  fieldMonthPlaceholder: params => (params.contentType === "letter" ? "mmm" : "mm"),
  fieldDayPlaceholder: () => "dd"
};

function DateProvider({ children, excludeAdpaterLocale = false }) {
  const i18n = useI18n();
  const adapterLocale = excludeAdpaterLocale ? null : localize(i18n);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={localeText} adapterLocale={adapterLocale}>
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
