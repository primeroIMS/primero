import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { TEXT_AREA } from "../constants";

import styles from "./styles.css";

const TextInput = ({ commonInputProps, metaInputProps }) => {
  const css = makeStyles(styles)();
  const { type, password, hint } = metaInputProps;
  const { inputClassname } = commonInputProps;
  const inputType = password ? "password" : "text";

  const renderHint = hint ? <span className={css.hint}>{hint}</span> : null;

  return (
    <Controller
      type={inputType}
      as={TextField}
      {...commonInputProps}
      helperText={
        <>
          {commonInputProps.helperText}
          {renderHint}
        </>
      }
      multiline={type && type === TEXT_AREA}
      defaultValue=""
      className={inputClassname}
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
