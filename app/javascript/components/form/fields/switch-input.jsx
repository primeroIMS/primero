import React from "react";
import PropTypes from "prop-types";
import {
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core";
import { Controller } from "react-hook-form";

const SwitchInput = ({ commonInputProps }) => {
  const { helperText, error, disabled, name, label } = commonInputProps;

  return (
    <FormControl error={error}>
      <FormGroup>
        <FormControlLabel
          labelPlacement="end"
          control={
            <Controller
              name={name}
              as={Switch}
              disabled={disabled}
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
    name: PropTypes.string
  })
};

export default SwitchInput;
