import React from "react";
import PropTypes from "prop-types";
import {
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core";

import Input from "../components/input";

const SwitchInput = ({ field, commonInputProps }) => {
  const { disabled, helperText } = commonInputProps;

  return (
    <Input field={field}>
      {({ handleChange, inputValue, label, error, hasError }) => (
        <FormControl error={hasError}>
          <FormGroup>
            <FormControlLabel
              labelPlacement="end"
              control={
                <Switch
                  onChange={handleChange}
                  checked={Boolean(inputValue) || false}
                  disabled={disabled}
                />
              }
              label={label}
            />
          </FormGroup>
          {(hasError || helperText) && (
            <FormHelperText>{error || helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    </Input>
  );
};

SwitchInput.displayName = "SwitchInput";

SwitchInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    helperText: PropTypes.string
  }),
  field: PropTypes.object.isRequired
};

export default SwitchInput;
