import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "@material-ui/pickers";

const DateField = ({ field, form, ...other }) => {
  const { name, value } = field;
  const fieldProps = {
    name,
    value,
    format: "dd-MMM-yyyy",
    onChange: date => form.setFieldValue(name, date, true),
    clearable: true,
    ...other
  };

  return <DatePicker {...fieldProps} />;
};

DateField.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object
};

export default DateField;
