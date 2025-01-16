import React, { useState } from "react";
import PropTypes from "prop-types";

import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { useI18n } from "../../../i18n";
import { DATE_FORMAT } from "../../../../config/constants";

const DateRangePicker = ({ fromDate, toDate, onChange, maxDate }) => {
  const i18n = useI18n();

  // Group useState variables together
  const [selectedFromDate, setSelectedFromDate] = useState(fromDate);
  const [selectedToDate, setSelectedToDate] = useState(toDate);
  const [validationError, setValidationError] = useState("");

  // Define props that are objects, calculated, or functions
  const fromDatePickerProps = {
    variant: "inline",
    format: DATE_FORMAT,
    margin: "normal",
    label: i18n.t("key_performance_indicators.date_range_dialog.from")+"*",
    value: selectedFromDate,
    onChange: handleFromChange,
    error: !!validationError,
    maxDate: maxDate || new Date(), // Allow customization of maxDate
    InputProps: {
      style: {
        borderColor: validationError ? "red" : undefined
      }
    },
    KeyboardButtonProps: {
      "aria-label": i18n.t("key_performance_indicators.date_range_dialog.aria-labels.from")
    }
  };

  const toDatePickerProps = {
    variant: "inline",
    format: DATE_FORMAT,
    margin: "normal",
    label: i18n.t("key_performance_indicators.date_range_dialog.to")+"*",
    value: selectedToDate,
    onChange: handleToChange,
    error: !!validationError,
    maxDate: maxDate || new Date(), // Allow customization of maxDate
    InputProps: {
      style: {
        borderColor: validationError ? "red" : undefined,
        marginLeft: "10px" // Add left margin here
      }
    },
    KeyboardButtonProps: {
      "aria-label": i18n.t("key_performance_indicators.date_range_dialog.aria-labels.to")
    }
  };

  function handleFromChange(date) {
    if (selectedToDate && date > selectedToDate) {
      setValidationError("From date should not be greater than To date");
      setSelectedFromDate(null);
    } else {
      setValidationError("");
      setSelectedFromDate(date);
      onChange(date, selectedToDate);
    }
  }

  function handleToChange(date) {
    if (selectedFromDate && selectedFromDate > date) {
      setValidationError("To date should not be smaller than From date");
      setSelectedToDate(null);
    } else {
      setValidationError("");
      setSelectedToDate(date);
      onChange(selectedFromDate, date);
    }
  }

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <KeyboardDatePicker {...fromDatePickerProps} />
          <KeyboardDatePicker {...toDatePickerProps} />
        </div>
      </MuiPickersUtilsProvider>
      <p>{validationError}</p>
    </>
  );
};

DateRangePicker.propTypes = {
  fromDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  toDate: PropTypes.instanceOf(Date),
};

DateRangePicker.defaultProps = {
  fromDate: null,
  maxDate: new Date(),
  toDate: null,
};


export default DateRangePicker;