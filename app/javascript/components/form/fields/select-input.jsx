import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Input from "../components/input";

const SelectInput = ({ field, commonInputProps }) => {
  const { display_name: displayName, multi_select: multiSelect } = field;
  const optionLabel = option => {
    const { display_name: name, display_text: displayText } = option;

    return name || displayText;
  };
  const { helperText, disabled, ...commonProps } = commonInputProps;

  return (
    <Input field={field}>
      {({ handleChange, inputOptions, inputValue, hasError, error }) => (
        <Autocomplete
          multiple={multiSelect}
          getOptionLabel={optionLabel}
          onChange={handleChange}
          options={inputOptions}
          value={inputValue}
          getOptionSelected={(option, value) => option.id === value.id}
          disabled={disabled}
          renderInput={params => (
            <TextField
              {...params}
              label={displayName}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              error={hasError}
              helperText={error || helperText}
              margin="normal"
              {...commonProps}
            />
          )}
        />
      )}
    </Input>
  );
};

SelectInput.displayName = "SelectInput";

SelectInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    helperText: PropTypes.string
  }),
  field: PropTypes.object.isRequired
};

export default SelectInput;
