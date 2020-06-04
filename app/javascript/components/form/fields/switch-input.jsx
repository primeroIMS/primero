import React from "react";
import PropTypes from "prop-types";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core";
import { Controller } from "react-hook-form";

const SwitchInput = ({ commonInputProps }) => {
  const {
    helperText,
    error,
    disabled,
    name,
    label,
    className
  } = commonInputProps;

  return (
    <FormControl error={error}>
      <FormGroup>
        <FormControlLabel
          labelPlacement="end"
          control={
            <Controller
              name={name}
              as={Checkbox}
              disabled={disabled}
              defaultValue={false}
            />
          }
          label={label}
          className={className}
        />
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

SwitchInput.displayName = "SwitchInput";

SwitchInput.propTypes = {
  commonInputProps: PropTypes.shape({
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string
  })
};

export default SwitchInput;
