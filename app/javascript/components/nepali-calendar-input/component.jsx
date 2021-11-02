import PropTypes from "prop-types";
import { FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

// import NepaliCalendar from "@sbmdkl/nepali-datepicker-reactjs";
import isEmpty from "lodash/isEmpty";
import { TimePicker } from "@material-ui/pickers";
import { useState } from "react";

import NepaliCalendar from "../../../../../nepali-datepicker-reactjs";
import { DATE_FORMAT_NE } from "../../config";

import styles from "./styles.css";
import { convertToNeDate } from "./utils";

const useStyles = makeStyles(styles);

const Component = ({ helpText, label, dateProps }) => {
  const css = useStyles();

  const [inputDate, setInputDate] = useState(null);
  const [inputTime, setInputTime] = useState(null);

  const { name, onChange, value, error, disabled, placeholder, dateIncludeTime } = dateProps;

  const inputValue = value ? convertToNeDate(value) : null;

  const inputContainerClasses = clsx(
    "MuiInputBase-root",
    "MuiInput-root",
    "MuiInput-underline",
    "MuiInputBase-fullWidth",
    "MuiInput-fullWidth",
    "MuiInputBase-formControl",
    "MuiInput-formControl",
    css.container,
    { "Mui-error": error, "Mui-disabled": disabled }
  );

  const calendarClasses = clsx("MuiInputBase-input", "MuiInput-input", { "Mui-disabled": disabled });

  const containerClasses = clsx({ [css.includeTimeContainer]: dateIncludeTime });

  const formControlClasses = "MuiTextField-root";

  const handleInputOnChange = ({ adDate }) => {
    if (dateIncludeTime) {
      setInputDate(adDate);
    } else {
      onChange(new Date(adDate));
    }
  };

  const handleTimeInputChange = time => {
    setInputTime(time);
  };

  return (
    <div className={containerClasses}>
      <FormControl fullWidth className={formControlClasses} error={error}>
        <InputLabel htmlFor={name} shrink>
          {label}
        </InputLabel>
        <div className={inputContainerClasses}>
          <NepaliCalendar
            className={calendarClasses}
            hideDefaultValue={isEmpty(inputValue)}
            placeholder={placeholder}
            onChange={handleInputOnChange}
            defaultDate={inputValue?.en}
            dateFormat={DATE_FORMAT_NE}
            inputProps={{ value: inputValue?.ne, disabled }}
          />
        </div>

        {helpText && <FormHelperText>{helpText}</FormHelperText>}
      </FormControl>
      {dateIncludeTime && (
        <div>
          <TimePicker
            disabled={disabled}
            label="Time"
            fullWidth
            value={inputValue?.time}
            placeholder={placeholder}
            InputLabelProps={{ shrink: true }}
            onChange={handleTimeInputChange}
          />
        </div>
      )}
    </div>
  );
};

Component.propTypes = {
  dateProps: PropTypes.object,
  helpText: PropTypes.string,
  label: PropTypes.string
};

Component.displayName = "NepaliCalendar";

export default Component;
