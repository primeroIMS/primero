import React from "react";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { useI18n } from "../../../i18n";
import localize from "../../../../libs/date-picker-localization";

const DateFieldPicker = ({ dateIncludeTime, dateProps, displayName, fieldTouched, fieldError, helperText }) => {
  const i18n = useI18n();
  const helpText = (fieldTouched && fieldError) || helperText || i18n.t("fields.date_help");
  const label = displayName ? displayName[i18n.locale] : "";

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localize(i18n)}>
      {dateIncludeTime ? (
        <DateTimePicker {...dateProps} helperText={helpText} label={label} />
      ) : (
        <DatePicker {...dateProps} helperText={helpText} label={label} />
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
