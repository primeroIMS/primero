import React from "react";
import PropTypes from "prop-types";
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox
} from "@material-ui/core";

import Input from "../components/input";

const CheckboxInput = ({ field, commonInputProps }) => {
  const renderOptions = ({
    inputOptions,
    fieldName,
    handleChange,
    isObject,
    inputValue,
    optionText,
    i18n
  }) => {
    const { disabled } = commonInputProps;

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
      {({hasError, error, ...rest}) => (
        <FormControl component="fieldset" error={hasError}>
          <FormLabel>{field.display_name}</FormLabel>
          <FormGroup>{renderOptions(rest)}</FormGroup>
        </FormControl>
      )}
    </Input>
  );
};

CheckboxInput.displayName = "CheckboxInput";

CheckboxInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool
  }),
  field: PropTypes.object.isRequired
};

export default CheckboxInput;
