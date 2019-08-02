import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "@material-ui/pickers";
import { InputAdornment } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { FastField } from "formik";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

const DateField = ({ name, helperText, ...rest }) => {
  const i18n = useI18n();

  const fieldProps = {
    name
  };

  return (
    <FastField
      {...fieldProps}
      render={({ field, form }) => {
        return (
          <DatePicker
            {...field}
            {...{
              format: "dd-MMM-yyyy",
              helperText: helperText || i18n.t("fields.date_help"),
              clearable: true,
              ...rest
            }}
            onChange={date => form.setFieldValue(name, date, true)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon />
                </InputAdornment>
              )
            }}
          />
        );
      }}
    />
  );
};

DateField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  helperText: PropTypes.string
};

export default DateField;
