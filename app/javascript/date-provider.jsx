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

function DateProvider({ children }) {
  const i18n = useI18n();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={localeText} adapterLocale={localize(i18n)}>
      {children}
    </LocalizationProvider>
  );
}

DateProvider.displayName = "DateProvider";

DateProvider.propTypes = {
  children: PropTypes.node
};

export default DateProvider;
