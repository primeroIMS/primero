import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import isEmpty from "lodash/isEmpty";

import { TEXT_AREA } from "../constants";
import InputLabel from "../components/input-label";

import styles from "./styles.css";

const TextInput = ({ commonInputProps, metaInputProps }) => {
  const css = makeStyles(styles)();
  const { control } = useFormContext();
  const { type, password, hint, tooltip, numeric, onBlur, onKeyPress } = metaInputProps;
  let inputType = "text";

  if (password) {
    inputType = "password";
  }

  if (numeric) {
    inputType = "number";
  }

  const { label, helperText, ...rest } = commonInputProps;

  const renderHint = hint ? <span className={css.hint}>{hint}</span> : null;

  const textAreaProps = type === TEXT_AREA ? { multiline: true, rows: 4 } : {};

  const inputProps = {
    ...(onBlur ? { onBlur } : {}),
    ...(onKeyPress ? { onKeyPress } : {})
  };

  return (
    <Controller
      control={control}
      type={inputType}
      as={TextField}
      label={<InputLabel tooltip={tooltip} text={label} />}
      {...rest}
      {...(isEmpty(inputProps) ? {} : { inputProps })}
      helperText={
        <>
          {helperText}
          {renderHint}
        </>
      }
      {...textAreaProps}
      defaultValue=""
    />
  );
};

TextInput.defaultProps = {
  metaInputProps: {}
};

TextInput.displayName = "TextInput";

TextInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object
};

export default TextInput;
