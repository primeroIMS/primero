import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { TEXT_AREA } from "../constants";
import InputLabel from "../components/input-label";

import styles from "./styles.css";

const TextInput = ({ commonInputProps, metaInputProps }) => {
  const css = makeStyles(styles)();
  const { type, password, hint, tooltip } = metaInputProps;
  const inputType = password ? "password" : "text";
  const { label, helperText, ...rest } = commonInputProps;

  const renderHint = hint ? <span className={css.hint}>{hint}</span> : null;

  return (
    <Controller
      type={inputType}
      as={TextField}
      label={<InputLabel tooltip={tooltip} text={label} />}
      {...rest}
      helperText={
        <>
          {helperText}
          {renderHint}
        </>
      }
      multiline={type && type === TEXT_AREA}
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
