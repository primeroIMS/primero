import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";

import { TEXT_AREA } from "../constants";
import InputLabel from "../components/input-label";

import css from "./styles.css";

const TextInput = ({ commonInputProps, metaInputProps, formMethods }) => {
  const { control } = formMethods;
  const { type, password, hint, tooltip, numeric, onBlur, onKeyPress, maxlength } = metaInputProps;
  let inputType = "text";

  if (password) {
    inputType = "password";
  }

  if (numeric) {
    inputType = "number";
  }

  const { label, helperText, defaultValue, ...rest } = commonInputProps;

  const renderHint = hint ? <span className={css.hint}>{hint}</span> : null;

  const textAreaProps = type === TEXT_AREA ? { multiline: true, rows: 4, ...(maxlength && { maxlength }) } : {};

  const inputProps = {
    ...(onBlur ? { onBlur } : {}),
    ...(onKeyPress ? { onKeyPress } : {})
  };

  const renderLabel = label ? <InputLabel tooltip={tooltip} text={label} /> : null;

  return (
    <Controller
      id="textinput"
      control={control}
      type={inputType}
      as={TextField}
      label={renderLabel}
      {...rest}
      {...(isEmpty(inputProps) ? {} : { inputProps })}
      helperText={
        (renderHint || helperText) && (
          <>
            {helperText}
            {renderHint}
          </>
        )
      }
      {...textAreaProps}
      defaultValue={defaultValue || ""}
    />
  );
};

TextInput.defaultProps = {
  metaInputProps: {}
};

TextInput.displayName = "TextInput";

TextInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object
};

export default TextInput;
