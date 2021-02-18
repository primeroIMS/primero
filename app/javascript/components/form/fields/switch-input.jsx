import React from "react";
import PropTypes from "prop-types";
import { Checkbox, FormControl, FormGroup, FormControlLabel, FormHelperText } from "@material-ui/core";
import { Controller } from "react-hook-form";

import InputLabel from "../components/input-label";

const SwitchInput = ({ commonInputProps, metaInputProps, formMethods }) => {
  const { helperText, error, disabled, name, label, className } = commonInputProps;
  const { control } = formMethods;
  const { tooltip, selectedValue } = metaInputProps || {};
  const checkBoxProps = { defaultValue: selectedValue || false };

  return (
    <FormControl error={error}>
      <FormGroup>
        <Controller
          control={control}
          name={name}
          render={({ onChange, onBlur, value, ref }) => (
            <FormControlLabel
              labelPlacement="end"
              control={
                <Checkbox
                  {...checkBoxProps}
                  onBlur={onBlur}
                  onChange={event => onChange(event.target.checked)}
                  checked={value}
                  inputRef={ref}
                  disabled={disabled}
                />
              }
              label={<InputLabel tooltip={tooltip} text={label} />}
              className={className}
            />
          )}
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
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.shape({
    tooltip: PropTypes.string
  })
};

export default SwitchInput;
