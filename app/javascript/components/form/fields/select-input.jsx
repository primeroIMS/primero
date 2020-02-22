import React from "react";
import PropTypes from "prop-types";
import { TextField, Chip } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Controller } from "react-hook-form";

const SelectInput = ({ commonInputProps, metaInputProps, options }) => {
  const { multiSelect } = metaInputProps;
  const { name, disabled, ...commonProps } = commonInputProps;

  const optionLabel = option => {
    const { display_name: displayName, display_text: displayText } =
      typeof option === "object"
        ? option
        : options.find(opt => opt.id === option) || {};

    return displayName || displayText;
  };

  const defaultValue = multiSelect ? [] : { id: "", display_text: "" };

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
      filterSelectedOptions
      defaultValue={defaultValue}
      renderInput={params => (
        <TextField {...params} margin="normal" {...commonProps} />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={optionLabel(option)}
            {...getTagProps({ index })}
            disabled={disabled}
          />
        ))
      }
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
