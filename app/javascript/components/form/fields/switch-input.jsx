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

import InputLabel from "../components/input-label";

const SwitchInput = ({ commonInputProps, metaInputProps }) => {
  const {
    helperText,
    error,
    disabled,
    name,
    label,
    className
  } = commonInputProps;

  const { tooltip } = metaInputProps || {};

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
          label={<InputLabel tooltip={tooltip} text={label} />}
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
  }),
  metaInputProps: PropTypes.shape({
    tooltip: PropTypes.string
  })
};

export default SwitchInput;
