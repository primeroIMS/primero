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
      {methods => (
        <Autocomplete
          multiple={multiSelect}
          getOptionLabel={optionLabel}
          onChange={methods.handleChange}
          options={methods.inputOptions}
          value={methods.inputValue}
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
              // error={typeof error !== "undefined"}
              // helperText={error?.message || helperText}
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
