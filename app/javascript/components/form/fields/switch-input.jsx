import React from "react";
import PropTypes from "prop-types";
import { Checkbox, FormControl, FormGroup, FormControlLabel, FormHelperText } from "@material-ui/core";
import { Controller } from "react-hook-form";

import InputLabel from "../components/input-label";

const SwitchInput = ({ commonInputProps, metaInputProps }) => {
  const { helperText, error, disabled, name, label, className } = commonInputProps;

  const { tooltip, selectedValue } = metaInputProps || {};

  const checkBoxProps = selectedValue
    ? { checked: selectedValue, defaultValue: selectedValue }
    : { defaultValue: false };

  return (
    <FormControl error={error}>
      <FormGroup>
        <Controller
          name={name}
          as={
            <FormControlLabel
              labelPlacement="end"
              control={<Checkbox {...checkBoxProps} />}
              label={<InputLabel tooltip={tooltip} text={label} />}
              className={className}
            />
          }
          disabled={disabled}
          defaultValue={false}
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
