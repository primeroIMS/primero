import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TEXT_AREA } from "../constants";
import InputLabel from "../components/input-label";

import styles from "./styles.css";

const TextInput = ({ commonInputProps, metaInputProps }) => {
  const css = makeStyles(styles)();
  const { type, password, hint, tooltip, numeric, onBlur } = metaInputProps;
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

  return (
    <Controller
      type={inputType}
      as={TextField}
      label={<InputLabel tooltip={tooltip} text={label} />}
      {...rest}
      {...(onBlur ? { inputProps: { onBlur } } : {})}
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
