import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { TextField } from "@material-ui/core";

import { TEXT_AREA } from "../constants";

const TextInput = ({ field, commonInputProps }) => {
  const { register, errors } = useFormContext();
  const { helperText, ...commonProps } = commonInputProps;
  const { name, type, required, autoFocus, password } = field;
  const error = errors[name];
  const inputType = password ? "password" : "text";

  return (
    <TextField
      type={inputType}
      autoFocus={autoFocus}
      required={required}
      error={typeof error !== "undefined"}
      helperText={error?.message || helperText}
      multiline={type === TEXT_AREA}
      name={name}
      inputRef={register}
      {...commonProps}
    />
  );
};

TextInput.displayName = "TextInput";

TextInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired
};

export default TextInput;
