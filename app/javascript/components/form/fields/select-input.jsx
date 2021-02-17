/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import { TextField, Chip } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import InputLabel from "../components/input-label";
import { getLoadingState, getValueFromOtherField } from "../selectors";
import { useMemoizedSelector } from "../../../libs";

const filter = createFilterOptions();

const SelectInput = ({ commonInputProps, metaInputProps, options, formMethods, isShow }) => {
  const { control, setValue, getValues } = formMethods;
  const {
    multiSelect,
    freeSolo,
    groupBy,
    tooltip,
    onChange,
    disableClearable,
    asyncParamsFromWatched,
    asyncParams,
    asyncAction,
    asyncOptions,
    asyncOptionsLoadingPath,
    watchedInputValues,
    clearDependentValues,
    clearDependentReason,
    setOtherFieldValues,
    maxSelectedOptions,
    multipleLimitOne
  } = metaInputProps;
  const { name, disabled, ...commonProps } = commonInputProps;
  const defaultOption = { id: "", display_text: "" };

  const dispatch = useDispatch();
  const loading = useMemoizedSelector(state => getLoadingState(state, asyncOptionsLoadingPath));
  const otherFieldValues = useMemoizedSelector(state => {
    if (!setOtherFieldValues) {
      return null;
    }

    return getValueFromOtherField(state, setOtherFieldValues, watchedInputValues);
  });

  const fetchAsyncOptions = () => {
    if (asyncOptions) {
      const params = asyncParamsFromWatched.reduce((prev, next) => {
        const obj = prev;

        if (Array.isArray(next)) {
          const [field, alias] = next;
          const value = watchedInputValues[field];

          if (value) obj[alias] = watchedInputValues[field];
        } else {
          const value = watchedInputValues[next];

          if (value) obj[next] = value;
        }

        return obj;
      }, {});

      dispatch(asyncAction({ ...params, ...asyncParams }));
    }
  };

  const handleOpen = () => {
    fetchAsyncOptions();
  };

  const loadingProps = {
    ...(asyncOptions && { loading })
  };

  const optionLabel = option => {
    if (typeof option === "string" && option === "") {
      return "";
    }
    const { display_name: displayName, display_text: displayText } =
      typeof option === "object" ? option : options?.find(opt => opt.id === option) || defaultOption;

    const freeSoloDisplayText = freeSolo && typeof option === "string" ? option : null;

    return displayName || displayText || freeSoloDisplayText || "";
  };

  const optionsUseIntegerIds = Number.isInteger(options?.[0]?.id);

  // eslint-disable-next-line no-nested-ternary
  const defaultValue = multiSelect || multipleLimitOne ? [] : optionsUseIntegerIds ? null : null;

  const handleChange = (data, reason) => {
    if (onChange) {
      onChange(formMethods, data);
    }

    if (clearDependentValues && clearDependentReason.includes(reason)) {
      clearDependentValues.forEach(field => {
        if (Array.isArray(field)) {
          const [fieldName, resetValue] = field;

          setValue(fieldName, resetValue);
        } else {
          setValue(field, null);
        }
      });
    }

    if (setOtherFieldValues) {
      otherFieldValues.forEach(([field, value]) => {
        setValue(field, value, { shouldDirty: true });
      });
    }

    return multiSelect || multipleLimitOne
      ? data?.reduce((prev, current) => {
          if (multipleLimitOne && getValues(name).includes(current)) {
            return prev;
          }

          prev.push(typeof current === "object" ? current?.id : current);

          return prev;
        }, [])
      : data?.id || null;
  };

  const optionEquality = (option, value) => option.id === value || option.id === value?.id;

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
        value: freeSolo ? optionLabel(params.inputProps.value) : params.inputProps.value
      },
      InputProps: {
        ...params.InputProps,
        endAdornment: (
          <>
            {loading && asyncOptions ? <CircularProgress color="primary" size={20} /> : null}
            {isShow || params.InputProps.endAdornment}
          </>
        )
      }
    };

    // eslint-disable-next-line react/prop-types
    const { label, ...rest } = props;

    return (
      <TextField {...inputParams} label={<InputLabel tooltip={tooltip} text={label} />} margin="normal" {...rest} />
    );
  };

  const renderTags = (value, getTagProps) =>
    value.map((option, index) => <Chip label={optionLabel(option)} {...getTagProps({ index })} disabled={disabled} />);

  const getOptionDisabled = () => {
    if (Object.is(maxSelectedOptions, null) || Object.is(getValues()[name], null)) {
      return false;
    }

    return getValues()[name].length === maxSelectedOptions;
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ value: fieldValue, onChange: fieldOnChange }) => (
        <Autocomplete
          name={name}
          onOpen={handleOpen}
          onChange={(_, data, reason) => fieldOnChange(handleChange(data, reason))}
          groupBy={option => option[groupBy]}
          options={options}
          multiple={multiSelect || multipleLimitOne}
          getOptionLabel={optionLabel}
          getOptionSelected={optionEquality}
          getOptionDisabled={getOptionDisabled}
          disabled={disabled}
          filterSelectedOptions
          disableClearable={disableClearable}
          freeSolo={freeSolo}
          {...filterOptions}
          {...loadingProps}
          renderInput={params => renderTextField(params, commonProps)}
          renderTags={(value, getTagProps) => renderTags(value, getTagProps)}
          value={fieldValue}
        />
      )}
    />
  );
};

SelectInput.displayName = "SelectInput";

SelectInput.defaultProps = {
  isShow: false,
  options: []
};

SelectInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    groupBy: PropTypes.string,
    helperText: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  formMethods: PropTypes.object.isRequired,
  isShow: PropTypes.bool,
  metaInputProps: PropTypes.object,
  options: PropTypes.array
};

export default SelectInput;
