import React from "react";
import PropTypes from "prop-types";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Chip, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useI18n } from "../i18n";

import { NAME } from "./constants";
import styles from "./styles.css";

const SearchableSelect = ({
  defaultValues,
  helperText,
  isClearable,
  isDisabled,
  isLoading,
  multiple,
  onChange,
  onBlur,
  onOpen,
  options,
  TextFieldProps,
  mode,
  InputLabelProps
}) => {
  const i18n = useI18n();
  const defaultEmptyValue = multiple ? [] : null;
  const { InputProps, ...restTextFieldProps } = TextFieldProps;
  const css = makeStyles(styles)();

  const optionLabel = option => {
    if (typeof option === "string" && option === "") {
      return "";
    }

    const { label } = typeof option === "object" ? option : options?.find(opt => opt.value === option) || "";

    return label || "";
  };

  const optionEquality = (option, selected) => option?.value === selected || option?.value === selected?.value;

  const optionDisabled = option => option?.isDisabled;

  const initialValues = () => {
    if (Array.isArray(defaultValues)) {
      const defaultValuesClear = defaultValues.filter(selected => selected.label);
      const values = defaultValuesClear.map(selected => selected?.value || null);

      return multiple ? values : values[0];
    }

    if (typeof defaultValues === "object") {
      return defaultValues?.value || defaultEmptyValue;
    }

    return defaultValues || defaultEmptyValue;
  };

  const disabledPlaceholder = mode?.isShow && !initialValues() ? "--" : "";

  const textFieldProps = params => ({
    InputProps: {
      ...params.InputProps,
      endAdornment: (
        <>
          {isLoading && <CircularProgress color="inherit" size={20} />}
          {mode?.isShow || params.InputProps.endAdornment}
        </>
      ),
      ...InputProps
    },
    fullWidth: true,
    helperText,
    InputLabelProps,
    placeholder: isDisabled ? disabledPlaceholder : i18n.t(`fields.select_${multiple ? "multiple" : "single"}`),
    ...restTextFieldProps
  });

  const renderTags = (value, getTagProps) =>
    value.map((option, index) => {
      const { onDelete, ...rest } = { ...getTagProps({ index }) };
      const chipProps = {
        ...(isDisabled || { onDelete }),
        ...rest,
        classes: {
          ...(mode.isShow && {
            disabled: css.disabledChip
          })
        }
      };

      return <Chip size="small" label={optionLabel(option)} {...chipProps} disabled={isDisabled} />;
    });

  const initialInputValue = initialValues() === null ? "" : optionLabel(initialValues());

  return (
    <Autocomplete
      onChange={(event, value) => onChange(value)}
      options={options}
      disabled={isDisabled}
      getOptionLabel={optionLabel}
      getOptionDisabled={optionDisabled}
      getOptionSelected={optionEquality}
      loading={isLoading}
      disableClearable={!isClearable}
      filterSelectedOptions
      value={initialValues()}
      onOpen={onOpen && onOpen}
      inputValue={initialInputValue}
      multiple={multiple}
      onBlur={onBlur}
      renderInput={params => <TextField {...params} {...textFieldProps(params)} disabled={isDisabled} />}
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
  mode: {},
  multiple: false,
  options: [],
  TextFieldProps: {}
};

SearchableSelect.propTypes = {
  defaultValues: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.object]),
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  mode: PropTypes.object,
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  options: PropTypes.array,
  TextFieldProps: PropTypes.object
};

export default SearchableSelect;
