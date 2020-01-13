import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Controller } from "react-hook-form";

const SelectInput = ({ commonInputProps, metaInputProps, options }) => {
  const { multiSelect } = metaInputProps;
  const { name, disabled, ...commonProps } = commonInputProps;
  console.log(options)
  const optionLabel = option => {
    const { display_name: displayName, display_text: displayText } =
      typeof option === "object"
        ? option
        : options.find(opt => opt.id === String(option)) || {};

    return displayName || displayText;
  };

  const defaultValue = multiSelect ? [] : undefined;

  const handleChange = data =>
    multiSelect
      ? data?.[1]?.map(selected =>
          typeof selected === "object" ? selected?.id : selected
        )
      : data?.[1]?.id;

  const optionEquality = (option, value) =>
    multiSelect ? option.id === value : option.id === value.id;

  return (
    <Controller
      name={name}
      as={Autocomplete}
      multiple={multiSelect}
      getOptionLabel={optionLabel}
      options={options}
      getOptionSelected={optionEquality}
      disabled={disabled}
      onChange={handleChange}
      defaultValue={defaultValue}
      filterSelectedOptions
      renderInput={params => (
        <TextField {...params} margin="normal" {...commonProps} />
      )}
    />
  );
};

SelectInput.displayName = "SelectInput";

SelectInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    name: PropTypes.string.isRequired
  }),
  metaInputProps: PropTypes.object,
  options: PropTypes.array
};

export default SelectInput;
