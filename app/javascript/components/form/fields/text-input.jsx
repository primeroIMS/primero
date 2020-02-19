import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";

import { TEXT_AREA } from "../constants";

const TextInput = ({ commonInputProps, metaInputProps }) => {
  const { type, password } = metaInputProps;
  const inputType = password ? "password" : "text";

  return (
    <Controller
      type={inputType}
      as={TextField}
      {...commonInputProps}
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
