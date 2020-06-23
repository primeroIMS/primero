import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { DatePicker, DateTimePicker } from "@material-ui/pickers";

const DateInput = ({ commonInputProps, metaInputProps }) => {
  const { dateIncludeTime } = metaInputProps;

  return (
    <Controller
      as={dateIncludeTime ? DateTimePicker : DatePicker}
      {...commonInputProps}
      helperText={<>{commonInputProps.helperText}</>}
      defaultValue=""
    />
  );
};

DateInput.defaultProps = {
  metaInputProps: {}
};

DateInput.displayName = "DateInput";

DateInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object
};

export default DateInput;
