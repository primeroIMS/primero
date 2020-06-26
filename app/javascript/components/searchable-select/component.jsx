import React from "react";
import PropTypes from "prop-types";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Chip, CircularProgress } from "@material-ui/core";

import { useI18n } from "../i18n";

import { NAME } from "./constants";

const SearchableSelect = ({
  defaultValues,
  helperText,
  isClearable,
  isDisabled,
  isLoading,
  multiple,
  name,
  onChange,
  onBlur,
  onOpen,
  options,
  TextFieldProps
}) => {
  const i18n = useI18n();
  const defaultEmptyValue = multiple ? [] : null;

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

  const initialValues = () => {
    if (Array.isArray(defaultValues)) {
      const values = defaultValues.map(selected => selected.value || null);

      return multiple ? values : values[0];
    }

    if (typeof defaultValues === "object") {
      return defaultValues?.value || defaultEmptyValue;
    }

    return defaultValues || defaultEmptyValue;
  };

  const textFieldProps = params => ({
    InputProps: {
      ...params.InputProps,
      endAdornment: (
        <>
          {isLoading && <CircularProgress color="inherit" size={20} />}
          {params.InputProps.endAdornment}
        </>
      )
    },
    fullWidth: true,
    helperText,
    InputLabelProps: {
      htmlFor: name,
      shrink: true
    },
    placeholder: isDisabled
      ? ""
      : i18n.t(`fields.select_${multiple ? "multiple" : "single"}`),
    ...TextFieldProps
  });

  const renderTags = (value, getTagProps) =>
    value.map((option, index) => {
      const { onDelete, ...rest } = { ...getTagProps({ index }) };
      const chipProps = {
        ...(isDisabled || { onDelete }),
        ...rest
      };

      return (
        <Chip
          size="small"
          label={optionLabel(option)}
          {...chipProps}
          disabled={isDisabled}
        />
      );
    });

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
      value={initialValues()}
      onOpen={onOpen && onOpen}
      multiple={multiple}
      onBlur={onBlur}
      renderInput={params => (
        <TextField
          {...params}
          {...textFieldProps(params)}
          disabled={isDisabled}
        />
      )}
      renderTags={(value, getTagProps) => renderTags(value, getTagProps)}
    />
  );
};

SearchableSelect.displayName = NAME;

SearchableSelect.defaultProps = {
  defaultValues: null,
  helperText: "",
  isClearable: true,
  isDisabled: false,
  isLoading: false,
  multiple: false,
  options: [],
  TextFieldProps: {}
};

SearchableSelect.propTypes = {
  defaultValues: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object
  ]),
  helperText: PropTypes.string,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  options: PropTypes.array,
  TextFieldProps: PropTypes.object
};

export default SearchableSelect;
