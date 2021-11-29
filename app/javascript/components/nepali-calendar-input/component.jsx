import PropTypes from "prop-types";
import { Button, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import isEmpty from "lodash/isEmpty";
import { TimePicker } from "@material-ui/pickers";
import { useEffect, useState } from "react";
import isDate from "lodash/isDate";
import { Calendar } from "@quoin/nepali-datepicker-reactjs";

import { useI18n } from "../i18n";
import { DATE_FORMAT_NE } from "../../config";

import styles from "./styles.css";
import { convertToNeDate } from "./utils";

const useStyles = makeStyles(styles);

const Component = ({ helpText, label, dateProps, handleClearable }) => {
  const css = useStyles();
  const i18n = useI18n();

  const { name, onChange, value, error, disabled, placeholder, dateIncludeTime } = dateProps;
  const inputValue = convertToNeDate(value);

  const [inputDate, setInputDate] = useState(null);
  const [inputTime, setInputTime] = useState(null);

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

  const handleInputOnChange = ({ adDate }) => {
    const [year, month, day] = adDate.split("-").map(parts => parseInt(parts, 0));

    const newDate = new Date(year, day, month);

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
      <FormControl fullWidth className={formControlClasses} error={error}>
        <InputLabel htmlFor={name} shrink>
          {label}
        </InputLabel>
        <div className={inputContainerClasses}>
          <Calendar
            className={calendarClasses}
            hideDefaultValue={isEmpty(inputValue)}
            placeholder={placeholder}
            onChange={handleInputOnChange}
            defaultDate={inputValue?.en}
            dateFormat={DATE_FORMAT_NE}
            clearable
            clearableBtn={Button}
            clearableBtnText={i18n.t("buttons.clear")}
            clearableClickHandler={handleClear}
            inputProps={{ value: inputValue?.ne, disabled }}
          />
        </div>

        {helpText && <FormHelperText>{helpText}</FormHelperText>}
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
