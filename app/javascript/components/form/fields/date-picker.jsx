// // Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name, react/no-multi-comp */
import PropTypes from "prop-types";
import { Controller, useWatch } from "react-hook-form";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { useState } from "react";

import { toServerDateFormat } from "../../../libs";
import { useI18n } from "../../i18n";
import localize from "../../../libs/date-picker-localization";
import "./styles.css";

function DatePickerComponent({ commonInputProps, metaInputProps, formMethods }) {
  const i18n = useI18n();
  const { setValue, control } = formMethods;
  const { name, label, helperText, error, disabled, placeholder } = commonInputProps;
  const [selectedDate, setSelectedDate] = useState(null);
  const currentValue = useWatch({ name, control });

  const { dateIncludeTime } = metaInputProps;

  const handleChange = date => {
    setValue(name, date ? toServerDateFormat(date, { includeTime: dateIncludeTime }) : "", { shouldDirty: true });
    setSelectedDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localize(i18n)}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <DatePicker
            {...field}
            label={label}
            value={selectedDate}
            onChange={handleChange}
            maxDate={new Date()} // Allow customization of maxDate
            renderInput={params => (
              <TextField
                {...params}
                error={!!error}
                helperText={error ? error.message : helperText}
                margin="normal"
                fullWidth
              />
            )}
          />
        )}
      />
    </LocalizationProvider>
  );
}

DatePickerComponent.defaultProps = {
  metaInputProps: {}
};

DatePickerComponent.displayName = "DatePickerComponent";

DatePickerComponent.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object,
  metaInputProps: PropTypes.object
};

export default DatePickerComponent;
