import React from "react";
import PropTypes from "prop-types";
import {
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";

const SwitchInput = ({ commonInputProps, metaInputProps }) => {
  const { helperText, error, disabled, name, label } = commonInputProps;
  const { watchDisableInput, watchDisable } = metaInputProps;
  const { watch } = useFormContext();
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

  return (
    <FormControl error={error}>
      <FormGroup>
        <FormControlLabel
          labelPlacement="end"
          control={
            <Controller
              name={name}
              as={Switch}
              disabled={disableField}
              defaultValue={false}
            />
          }
          label={label}
        />
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

SwitchInput.displayName = "SwitchInput";

SwitchInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
    metaInputProps: PropTypes.object,
    name: PropTypes.string
  })
};

export default SwitchInput;
