import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "@material-ui/pickers";
import { useI18n } from "components/i18n";
import { FastField } from "formik";

const DateField = ({ name, value, helperText, ...other }) => {
  const i18n = useI18n();

  const fieldProps = {
    name,
    value
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
              ...other
            }}
            onChange={date => form.setFieldValue(name, date, true)}
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
