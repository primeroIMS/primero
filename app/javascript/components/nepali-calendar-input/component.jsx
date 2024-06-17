// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { FormControl, InputLabel } from "@mui/material";
import { cx } from "@emotion/css"
import { useEffect, useState } from "react";
import isDate from "lodash/isDate";
import { NepaliDatePicker } from "mui-nepali-datepicker-reactjs";
import { BSToAD } from "bikram-sambat-js";

import css from "./styles.css";
import { convertToNeDate, parseDate } from "./utils";

function Component({ helpText, label, dateProps }) {
  const { name, onChange, value, error, disabled, placeholder, dateIncludeTime, InputProps } = dateProps;
  const inputValue = convertToNeDate(value);

  const [inputDate, setInputDate] = useState(null);
  const [inputTime, setInputTime] = useState(null);

  const containerClasses = cx({ [css.includeTimeContainer]: dateIncludeTime });

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

  useEffect(() => {
    if (dateIncludeTime && inputDate) {
      const time = new Date();

      time.setHours(0, 0, 0, 0);

      setInputTime(time);
    } else {
      setInputTime(null);
    }
  }, [inputDate]);

  useEffect(() => {
    if (dateIncludeTime) {
      const inputTimeValue = dateTimeInputValue();

      if (inputTimeValue) onChange(inputTimeValue);
    }
  }, [inputDate, inputTime]);

  return (
    <div className={containerClasses} data-testid="nepali-container">
      <FormControl fullWidth error={error}>
        <InputLabel htmlFor={name} shrink>
          {label}
        </InputLabel>
        <NepaliDatePicker
          onSelect={handleInputOnChange}
          value={inputValue}
          componentProps={{
            fullWidth: true,
            helperText: helpText,
            disabled,
            placeholder,
            InputProps: {
              endAdornment: InputProps?.endAdornment
            }
          }}
          resetButtonProps={{
            color: "primary"
          }}
        />
      </FormControl>
    </div>
  );
}

Component.propTypes = {
  dateProps: PropTypes.object,
  helpText: PropTypes.string,
  label: PropTypes.string
};

Component.displayName = "NepaliCalendar";

export default Component;
