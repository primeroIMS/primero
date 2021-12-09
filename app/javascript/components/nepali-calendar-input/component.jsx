import PropTypes from "prop-types";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
import clsx from "clsx";
import { TimePicker } from "@material-ui/pickers";
import { useEffect, useState } from "react";
import isDate from "lodash/isDate";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { BSToAD } from "bikram-sambat-js";

import { useI18n } from "../i18n";

import css from "./styles.css";
import { convertToNeDate } from "./utils";

const Component = ({ helpText, label, dateProps, handleClearable }) => {
  const i18n = useI18n();

  const { name, onChange, value, error, disabled, placeholder, dateIncludeTime } = dateProps;
  const inputValue = convertToNeDate(value);

  const [inputDate, setInputDate] = useState(null);
  const [inputTime, setInputTime] = useState(null);

  const containerClasses = clsx({ [css.includeTimeContainer]: dateIncludeTime });

  const dateTimeInputValue = () => {
    if (!isDate(inputDate) && isDate(inputTime)) {
      return inputTime;
    }

    if (isDate(inputDate) && isDate(inputTime)) {
      inputDate.setHours(inputTime.getHours(), inputTime.getMinutes());

      return inputDate;
    }

    return null;
  };

  const handleInputOnChange = newValue => {
    const adDate = BSToAD(newValue);
    const newDate = parseDate(adDate);

    if (dateIncludeTime) {
      setInputDate(newDate);
    } else {
      onChange(newDate);
    }
  };

  const handleTimeInputChange = time => {
    setInputTime(time);
  };

  const handleClear = () => {
    if (handleClearable) handleClearable();
  };

  useEffect(() => {
    if (dateIncludeTime) {
      const inputTimeValue = dateTimeInputValue();

      if (inputTimeValue) onChange(inputTimeValue);
    }
  }, [inputDate, inputTime]);

  return (
    <div className={containerClasses}>
      <FormControl fullWidth error={error}>
        <InputLabel htmlFor={name} shrink>
          {label}
        </InputLabel>
        <NepaliDatePicker
          onSelect={handleInputOnChange}
          value={inputValue}
          component={TextField}
          componentProps={{
            fullWidth: true,
            helperText: helpText,
            disabled,
            placeholder
          }}
        />
      </FormControl>
      {dateIncludeTime && (
        <div>
          <TimePicker
            disabled={disabled}
            label={i18n.t("fields.time")}
            fullWidth
            value={inputValue.time}
            placeholder={placeholder}
            InputLabelProps={{ shrink: true }}
            onChange={handleTimeInputChange}
            clearable
          />
        </div>
      )}
    </div>
  );
};

Component.propTypes = {
  dateProps: PropTypes.object,
  handleClearable: PropTypes.func,
  helpText: PropTypes.string,
  label: PropTypes.string
};

Component.displayName = "NepaliCalendar";

export default Component;
