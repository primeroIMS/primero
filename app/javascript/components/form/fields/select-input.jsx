import React from "react";
import PropTypes from "prop-types";
import { TextField, Chip } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Controller } from "react-hook-form";

const SelectInput = ({ commonInputProps, metaInputProps, options }) => {
  const { multiSelect } = metaInputProps;
  const { name, disabled, ...commonProps } = commonInputProps;
  const defaultOption = { id: "", display_text: "" };

  const optionLabel = option => {
    const { display_name: displayName, display_text: displayText } =
      typeof option === "object"
        ? option
        : options?.find(opt => opt.id === option) || defaultOption;

    return displayName || displayText;
  };

  const optionsUseIntegerIds = Number.isInteger(options?.[0]?.id);

  // eslint-disable-next-line no-nested-ternary
  const defaultValue = multiSelect ? [] : optionsUseIntegerIds ? null : null;

  const handleChange = data => {
    return multiSelect
      ? data?.[1]?.map(selected =>
          typeof selected === "object" ? selected?.id : selected
        )
      : data?.[1]?.id || "";
  };

  const optionEquality = (option, value) =>
    option.id === value || option.id === value?.id;

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      onChange={handleChange}
      as={
        <Autocomplete
          multiple={multiSelect}
          getOptionLabel={optionLabel}
          options={options}
          getOptionSelected={optionEquality}
          disabled={disabled}
          filterSelectedOptions
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
      }
    />
  );
};

SelectInput.displayName = "SelectInput";

SelectInput.defaultProps = {
  options: []
};

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
