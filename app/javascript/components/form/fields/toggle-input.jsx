// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Checkbox, FormControl, FormGroup, FormControlLabel, FormHelperText } from "@material-ui/core";
import { Controller } from "react-hook-form";

const ToggleInput = ({ commonInputProps, formMethods }) => {
  const { control } = formMethods;
  const { helperText, error, disabled, name, label, className, id } = commonInputProps;

  return (
    <FormControl id={id} error={error} className={className}>
      <FormGroup>
        <FormControlLabel
          disabled={disabled}
          labelPlacement="end"
          control={
            <Controller
              name={name}
              render={params => (
                <Checkbox
                  onChange={event => params.onChange(event.target.checked)}
                  checked={params.value}
                  name={name}
                />
              )}
              defaultValue={false}
              control={control}
            />
          }
          label={label}
        />
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

ToggleInput.displayName = "ToggleInput";

ToggleInput.propTypes = {
  commonInputProps: PropTypes.shape({
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    name: PropTypes.string
  }),
  formMethods: PropTypes.object.isRequired
};

export default ToggleInput;
