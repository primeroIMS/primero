import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { useI18n } from "../../../i18n";
import localize from "../../../../libs/date-picker-localization";
import { displayNameHelper } from "../../../../libs";

const DateFieldPicker = ({ dateIncludeTime, dateProps, displayName, fieldTouched, fieldError, helperText }) => {
  const i18n = useI18n();
  const helpText =
    (fieldTouched && fieldError) ||
    helperText ||
    i18n.t(`fields.${dateIncludeTime ? "date_help_with_time" : "date_help"}`);
  const label = displayNameHelper(displayName, i18n.locale);
  const dialogLabels = {
    clearLabel: i18n.t("buttons.clear"),
    cancelLabel: i18n.t("buttons.cancel"),
    okLabel: i18n.t("buttons.ok")
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localize(i18n)}>
      {dateIncludeTime ? (
        <DateTimePicker {...dialogLabels} {...dateProps} helperText={helpText} label={label} />
      ) : (
        <DatePicker {...dialogLabels} {...dateProps} helperText={helpText} label={label} />
      )}
    </MuiPickersUtilsProvider>
  );
};

DateFieldPicker.displayName = "DateFieldPicker";

DateFieldPicker.defaultProps = {
  dateIncludeTime: false,
  fieldTouched: false
};

DateFieldPicker.propTypes = {
  dateIncludeTime: PropTypes.bool,
  dateProps: PropTypes.object,
  displayName: PropTypes.object,
  fieldError: PropTypes.string,
  fieldTouched: PropTypes.bool,
  helperText: PropTypes.string
};

export default DateFieldPicker;
