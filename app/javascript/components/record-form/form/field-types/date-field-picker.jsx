// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";

import { useI18n } from "../../../i18n";
import { displayNameHelper } from "../../../../libs";
import { LOCALE_KEYS } from "../../../../config";
import NepaliCalendar from "../../../nepali-calendar-input";

function DateFieldPicker({
  dateIncludeTime = false,
  dateProps,
  displayName,
  fieldTouched = false,
  fieldError,
  helperText
}) {
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

  if (i18n.locale === LOCALE_KEYS.ne) {
    return <NepaliCalendar helpText={helpText} label={label} dateProps={dateProps} />;
  }

  const textFieldProps = {
    textField: {
      "data-testid": dateIncludeTime ? "date-time-picker" : "date-picker",
      InputLabelProps: { shrink: true },
      fullWidth: true,
      helperText: helpText
    }
  };

  return dateIncludeTime ? (
    <DateTimePicker
      data-testid="date-time-picker"
      {...dialogLabels}
      {...dateProps}
      helperText={helpText}
      slotProps={textFieldProps}
      label={label}
    />
  ) : (
    <DatePicker data-testid="date-picker" slotProps={textFieldProps} {...dialogLabels} {...dateProps} label={label} />
  );
}

DateFieldPicker.displayName = "DateFieldPicker";

DateFieldPicker.propTypes = {
  dateIncludeTime: PropTypes.bool,
  dateProps: PropTypes.object,
  displayName: PropTypes.object,
  fieldError: PropTypes.string,
  fieldTouched: PropTypes.bool,
  helperText: PropTypes.string
};

export default DateFieldPicker;
