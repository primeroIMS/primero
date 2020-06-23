import React from "react";
import PropTypes from "prop-types";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

import { NAME } from "./constants";

const SearchableSelect = ({
  onChange,
  isLoading,
  isDisabled,
  isClearable,
  helperText,
  defaultValues,
  TextFieldProps,
  options
}) => {
  const optionLabel = option => {
    if (typeof option === "string" && option === "") {
      return "";
    }

    const { label } =
      typeof option === "object"
        ? option
        : options?.find(opt => opt.value === option) || "";

    return label || "";
  };

  const optionEquality = (option, selected) =>
    option?.value === selected || option?.value === selected?.value;

  const initialValues = Array.isArray(defaultValues)
    ? defaultValues.map(selected => selected.value || "")[0]
    : defaultValues || "";

  return (
    <Autocomplete
      onChange={(event, value) => onChange(value)}
      options={options}
      disabled={isDisabled}
      getOptionLabel={optionLabel}
      getOptionSelected={optionEquality}
      loading={isLoading}
      disableClearable={!isClearable}
      filterSelectedOptions
      value={initialValues}
      renderInput={params => (
        <TextField
          {...params}
          {...TextFieldProps}
          helperText={helperText}
          disabled={isDisabled}
        />
      )}
    />
  );
};

SearchableSelect.displayName = NAME;

SearchableSelect.defaultProps = {
  defaultValues: [],
  helperText: "",
  isClearable: true,
  isDisabled: false,
  isLoading: false,
  options: [],
  TextFieldProps: {}
};

SearchableSelect.propTypes = {
  defaultValues: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  helperText: PropTypes.string,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  TextFieldProps: PropTypes.object
};

export default SearchableSelect;
