import React from "react";
import PropTypes from "prop-types";
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  FormHelperText
} from "@material-ui/core";

import Input from "../components/input";

const CheckboxInput = ({ field, commonInputProps }) => {
  const { disabled, helperText } = commonInputProps;

  const renderOptions = ({
    inputOptions,
    fieldName,
    handleChange,
    isObject,
    inputValue,
    optionText,
    i18n
  }) => {
    return inputOptions.map(option => {
      return (
        <FormControlLabel
          key={`${fieldName}-${option.id}`}
          control={
            <Checkbox
              onChange={handleChange}
              value={option.id}
              checked={
                isObject
                  ? option.key in inputValue
                  : inputValue.includes(option.id)
              }
              disabled={disabled}
            />
          }
          label={optionText(option, i18n)}
        />
      );
    });
  };

  return (
    <Input field={field}>
      {({ hasError, error, ...rest }) => (
        <FormControl component="fieldset" error={hasError}>
          <FormLabel>{field.display_name}</FormLabel>
          <FormGroup>{renderOptions(rest)}</FormGroup>
          <FormHelperText>{error || helperText}</FormHelperText>
        </FormControl>
      )}
    </Input>
  );
};

CheckboxInput.displayName = "CheckboxInput";

CheckboxInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    helperText: PropTypes.string
  }),
  field: PropTypes.object.isRequired
};

export default CheckboxInput;
