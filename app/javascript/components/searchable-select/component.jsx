/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AutoCompleteInput from "./components/auto-complete-input";
import { NAME } from "./constants";
import styles from "./styles.css";
import { optionLabel, optionEquality, optionDisabled, filterOptions } from "./utils";
import { listboxClasses, virtualize } from "./components/listbox-component";

const useStyles = makeStyles(styles);

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
  InputLabelProps,
  optionIdKey,
  optionLabelKey
}) => {
  const defaultEmptyValue = multiple ? [] : null;
  const css = useStyles();

  const initialValues = (() => {
    if (Array.isArray(defaultValues)) {
      const defaultValuesClear = defaultValues.filter(selected => selected[optionLabelKey]);
      const values = defaultValuesClear.map(selected => selected?.[optionIdKey] || null);

      return multiple ? values || [] : values[0] || null;
    }

    if (typeof defaultValues === "object") {
      return defaultValues?.[optionIdKey] || defaultEmptyValue;
    }

    return defaultValues || defaultEmptyValue;
  })();

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

      return (
        <Chip
          size="small"
          label={optionLabel(option, options, optionIdKey, optionLabelKey)}
          {...chipProps}
          disabled={isDisabled}
        />
      );
    });

  const getSelectedOptions = (option, selected) => optionEquality(option, selected, optionIdKey);
  const getOptionLabel = option => optionLabel(option, options, optionIdKey, optionLabelKey);
  const handleOnChange = (_, value) => onChange(value);
  const handleRenderTags = (value, getTagProps) => renderTags(value, getTagProps);

  return (
    <Autocomplete
      onChange={handleOnChange}
      options={options}
      disabled={isDisabled}
      getOptionLabel={getOptionLabel}
      getOptionDisabled={optionDisabled}
      getOptionSelected={getSelectedOptions}
      loading={isLoading}
      disableClearable={!isClearable}
      filterSelectedOptions
      filterOptions={filterOptions}
      value={initialValues}
      onOpen={onOpen && onOpen}
      multiple={multiple}
      onBlur={onBlur}
      ListboxComponent={virtualize(options.length)}
      classes={listboxClasses}
      disableListWrap
      renderInput={params => (
        <AutoCompleteInput
          ref={params.InputProps.ref}
          mode={mode}
          params={params}
          value={initialValues}
          helperText={helperText}
          InputLabelProps={InputLabelProps}
          TextFieldProps={TextFieldProps}
          isDisabled={isDisabled}
          isLoading={isLoading}
          multiple={multiple}
          options={options}
          optionIdKey={optionIdKey}
          optionLabelKey={optionLabelKey}
        />
      )}
      renderTags={handleRenderTags}
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
  optionIdKey: "value",
  optionLabelKey: "label",
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
  optionIdKey: PropTypes.string,
  optionLabelKey: PropTypes.string,
  options: PropTypes.array,
  TextFieldProps: PropTypes.object
};

export default SearchableSelect;
