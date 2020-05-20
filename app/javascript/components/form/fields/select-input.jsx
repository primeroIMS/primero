/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import { TextField, Chip } from "@material-ui/core";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import { Controller } from "react-hook-form";

const filter = createFilterOptions();

const SelectInput = ({ commonInputProps, metaInputProps, options }) => {
  const { multiSelect, freeSolo, groupBy } = metaInputProps;
  const { name, disabled, ...commonProps } = commonInputProps;
  const defaultOption = { id: "", display_text: "" };

  const optionLabel = option => {
    if (typeof option === "string" && option === "") {
      return "";
    }
    const { display_name: displayName, display_text: displayText } =
      typeof option === "object"
        ? option
        : options?.find(opt => opt.id === option) || defaultOption;

    const freeSoloDisplayText =
      freeSolo && typeof option === "string" ? option : null;

    return displayName || displayText || freeSoloDisplayText;
  };

  const optionsUseIntegerIds = Number.isInteger(options?.[0]?.id);

  // eslint-disable-next-line no-nested-ternary
  const defaultValue = multiSelect ? [] : optionsUseIntegerIds ? null : null;

  const handleChange = data => {
    return multiSelect
      ? data?.[1]?.map(selected =>
          typeof selected === "object" ? selected?.id : selected
        )
      : data?.[1]?.id || null;
  };

  const optionEquality = (option, value) =>
    option.id === value || option.id === value?.id;

  const filterOptions = {
    ...(freeSolo && {
      filterOptions: (selectOptions, selectState) => {
        const filtered = filter(selectOptions, selectState);
        const allFiltered = filter(options, selectState);

        // In edit mode the selectOptions will not contain the selected option.
        // To determine if we should push the "Add" option, we check if the
        // selected option does not exists in the original options array.
        if (selectState.inputValue !== "" && allFiltered.length === 0) {
          filtered.push({
            id: selectState.inputValue,
            display_name: `Add "${selectState.inputValue}"`
          });
        }

        // If filtered is empty we return the current selectOptions, because
        // this should happen only if the selected option is
        // not part of the selectOptions but exists in the original
        // options.
        return filtered.length ? filtered : selectOptions;
      }
    })
  };

  // eslint-disable-next-line react/display-name
  const renderTextField = (params, props) => {
    const inputParams = {
      ...params,
      inputProps: {
        ...params.inputProps,
        value: freeSolo
          ? optionLabel(params.inputProps.value)
          : params.inputProps.value
      }
    };

    return <TextField {...inputParams} margin="normal" {...props} />;
  };

  const renderTags = (value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        label={optionLabel(option)}
        {...getTagProps({ index })}
        disabled={disabled}
      />
    ));

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      onChange={handleChange}
      as={
        <Autocomplete
          groupBy={option => option[groupBy]}
          options={options}
          multiple={multiSelect}
          getOptionLabel={optionLabel}
          getOptionSelected={optionEquality}
          disabled={disabled}
          filterSelectedOptions
          freeSolo={freeSolo}
          {...filterOptions}
          renderInput={params => renderTextField(params, commonProps)}
          renderTags={(value, getTagProps) => renderTags(value, getTagProps)}
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
    groupBy: PropTypes.string,
    helperText: PropTypes.string,
    name: PropTypes.string.isRequired
  }),
  metaInputProps: PropTypes.object,
  options: PropTypes.array
};

export default SelectInput;
