// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { isString } from "formik";
import { parseISO } from "date-fns";

import { useI18n } from "../../../i18n";
import { displayNameHelper } from "../../../../libs";
import { LOCALE_KEYS } from "../../../../config";
import NepaliCalendar from "../../../nepali-calendar-input";
import DateProvider from "../../../../date-provider";
import { dayOfWeekFormatter } from "../../../../libs/date-picker-localization";

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
  const {
    id,
    name,
    value,
    format,
    disabled,
    disableFuture,
    dateIncludeTime: _dateIncludeTime,
    placeholder,
    onChange,
    error,
    ...textInputProps
  } = dateProps;
  const datePickerProps = {
    id,
    name,
    value: isString(value) ? parseISO(value) : value,
    format,
    disabled,
    disableFuture
  };

  if (i18n.locale === LOCALE_KEYS.ne) {
    return <NepaliCalendar helpText={helpText} label={label} dateProps={dateProps} />;
  }

  const textFieldProps = {
    actionBar: {
      actions: ["clear", "accept"]
    },
    textField: {
      ...textInputProps,
      "data-testid": dateIncludeTime ? "date-time-picker" : "date-picker",
      helperText: helpText,
      InputProps: {
        readOnly: textInputProps?.readOnly
      },
      placeholder: placeholder || "",
      error
    }
  };

  const DateComponent = dateIncludeTime ? DateTimePicker : DatePicker;

  return (
    <DateProvider>
      <DateComponent
        data-testid="date-time-picker"
        onChange={onChange}
        {...dialogLabels}
        {...datePickerProps}
        slotProps={textFieldProps}
        label={label}
        dayOfWeekFormatter={dayOfWeekFormatter(i18n)}
      />
    </DateProvider>
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
