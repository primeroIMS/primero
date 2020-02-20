import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@material-ui/core";

import { TEXT_AREA } from "../constants";

const TextInput = ({ commonInputProps, metaInputProps }) => {
  const { watch } = useFormContext();
  const {
    type,
    password,
    watchInput,
    hideIfWatch,
    helpTextIfWatch,
    watchDisable,
    watchDisableInput
  } = metaInputProps;
  const inputType = password ? "password" : "text";
  const { helperText, disabled, ...additionalInputProps } = commonInputProps;
  const watchedField = watchInput
    ? watch(watchInput, commonInputProps.label)
    : null;
  let showField = true;

  if (watchedField && hideIfWatch) {
    showField = !hideIfWatch(watchedField);
  }

  const watchHelperText =
    helpTextIfWatch && watchedField
    ? helpTextIfWatch(watchedField)
    : helperText;
  const watchedDisableField = watchDisableInput
    ? watch(watchDisableInput, "")
    : false;
  let disableField = disabled;

  if (
    !disabled &&
    watchDisableInput &&
    watchDisable &&
    watchedDisableField !== false
  ) {
    disableField = watchDisable(watchedDisableField);
  }

  return showField ? (
    <Controller
      type={inputType}
      as={TextField}
      {...additionalInputProps}
      multiline={type && type === TEXT_AREA}
      helperText={watchHelperText}
      defaultValue=""
      disabled={disableField}
    />
  ) : null;
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
