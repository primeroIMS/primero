import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { TEXT_AREA } from "../constants";

import styles from "./styles.css";

const TextInput = ({ commonInputProps, metaInputProps, hint }) => {
  const css = makeStyles(styles)();
  const { type, password } = metaInputProps;
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
    />
  );
};

TextInput.defaultProps = {
  metaInputProps: {}
};

TextInput.displayName = "TextInput";

TextInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  hint: PropTypes.string,
  metaInputProps: PropTypes.object
};

export default TextInput;
