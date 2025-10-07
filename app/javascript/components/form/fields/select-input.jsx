// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField, Chip } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { isEmpty, isNil, isNumber } from "lodash";

import InputLabel from "../components/input-label";
import { getLoadingState, getValueFromOtherField } from "../selectors";
import { useMemoizedSelector } from "../../../libs";
import { SELECT_CHANGE_REASON } from "../constants";
import { listboxClasses, virtualize } from "../../searchable-select/components/listbox-component";
import { useI18n } from "../../i18n";
import { filterOptions as filterOptionsConfig } from "../../searchable-select/utils";

import css from "./styles.css";

const filter = createFilterOptions({ limit: 50 });

function SelectInput({ commonInputProps, metaInputProps, options: allOptions = [], formMethods, isShow = false }) {
  const { control, setValue, getValues } = formMethods;
  const {
    multiSelect,
    additionalOptions = [],
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
  const { name, disabled, id, ...commonProps } = commonInputProps;
  const defaultOption = { id: "", display_text: "" };
  const i18n = useI18n();
  const currentWatchedValue = watchedInputValues && watchedInputValues[name];

  const [stickyOption, setStickyOption] = useState(currentWatchedValue);
  const dispatch = useDispatch();
  const loading = useMemoizedSelector(state => getLoadingState(state, asyncOptionsLoadingPath));
  const otherFieldValues = useMemoizedSelector(state => {
    if (!setOtherFieldValues) {
      return null;
    }

    return getValueFromOtherField(state, setOtherFieldValues, watchedInputValues);
  });

  const options = [...allOptions, ...additionalOptions].filter(
    option =>
      !option?.disabled ||
      (option?.disabled && stickyOption && Array.isArray(stickyOption)
        ? stickyOption.includes(option.id)
        : option.id === stickyOption)
  );

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
    if ((typeof option === "string" && option === "") || isNil(option)) {
      return "";
    }

    const {
      display_name: displayName,
      display_text: displayText,
      translate
    } = typeof option === "object" ? option : options?.find(opt => opt.id === option) || defaultOption;

    const freeSoloDisplayText = freeSolo && typeof option === "string" ? option : null;

    if (translate) {
      return i18n.t(displayText) || "";
    }

    const displayNameI18n = Array.isArray(displayName) ? i18n.t(displayName.join(".")) : displayName;

    return displayNameI18n || displayText || freeSoloDisplayText || "";
  };

  const optionsUseIntegerIds = Number.isInteger(options?.[0]?.id);

  // eslint-disable-next-line no-nested-ternary
  const defaultValue = multiSelect || multipleLimitOne ? [] : optionsUseIntegerIds ? null : null;

  const handleChange = (data, reason) => {
    if (onChange) {
      onChange(formMethods, data);
    }

    if (
      clearDependentValues &&
      (clearDependentReason.includes(reason) || (reason === SELECT_CHANGE_REASON.removeOption && isEmpty(data)))
    ) {
      clearDependentValues.forEach(field => {
        if (Array.isArray(field)) {
          const [fieldName, resetValue] = field;

          setValue(fieldName, resetValue);
        } else {
          setValue(field, null);
        }
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

  const filterOptions = freeSolo
    ? (selectOptions, selectState) => {
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
    : filterOptionsConfig;

  // eslint-disable-next-line react/display-name
  const renderTextField = (params, props, fieldValue) => {
    // Workaround for: https://github.com/mui-org/material-ui/issues/19173
    const value =
      !freeSolo && !params.inputProps.value && options && fieldValue
        ? optionLabel(fieldValue)
        : params.inputProps.value;

    const inputParams = {
      ...params,
      inputProps: {
        ...params.inputProps,
        value: freeSolo ? optionLabel(params.inputProps.value) : value
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

    return <TextField {...inputParams} label={<InputLabel tooltip={tooltip} text={label} />} {...rest} />;
  };

  const renderTags = (value, getTagProps) =>
    value.map((option, index) => {
      const { key, ...tagProps } = getTagProps({ index });

      return <Chip key={key} label={optionLabel(option)} {...tagProps} disabled={disabled} />;
    });

  const getOptionDisabled = option => {
    if (option?.disabled) {
      return true;
    }

    if (Object.is(maxSelectedOptions, null) || Object.is(getValues()[name], null)) {
      return false;
    }

    return getValues()[name].length === maxSelectedOptions || option?.disabled;
  };

  const updateOtherFields = () => {
    if (currentWatchedValue && setOtherFieldValues) {
      otherFieldValues.forEach(([field, value]) => {
        setValue(field, value, { shouldDirty: true });
      });
    }
  };

  const updateStickyOption = () => {
    if (!isNil(currentWatchedValue) && !isNumber(stickyOption) && (isNil(stickyOption) || isEmpty(stickyOption))) {
      setStickyOption(currentWatchedValue);
    }
  };

  useEffect(() => {
    updateStickyOption();
    updateOtherFields();
  }, [currentWatchedValue]);

  const handleRenderTags = (value, getTagProps) => renderTags(value, getTagProps);
  const renderInput = fieldValue => params => renderTextField(params, commonProps, fieldValue);
  const handleAutocompleteOnChange = fieldOnChange => (_, data, reason) => fieldOnChange(handleChange(data, reason));
  const handleGroupBy = option => option[groupBy];
  const handleGetOptionDisabled = option => getOptionDisabled(option);
  const handleMultiSelectValue = fieldValue => {
    if (multiSelect) {
      if (Array.isArray(fieldValue)) {
        return fieldValue;
      }

      return [fieldValue];
    }

    return fieldValue;
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ value: fieldValue, onChange: fieldOnChange }) => (
        <Autocomplete
          id={id}
          name={name}
          onOpen={handleOpen}
          onChange={handleAutocompleteOnChange(fieldOnChange)}
          groupBy={handleGroupBy}
          ListboxComponent={virtualize(options.length)}
          classes={{ listbox: listboxClasses }}
          disableListWrap
          options={options}
          multiple={multiSelect || multipleLimitOne}
          getOptionLabel={optionLabel}
          isOptionEqualToValue={optionEquality}
          getOptionDisabled={handleGetOptionDisabled}
          disabled={disabled}
          filterSelectedOptions
          disableClearable={disableClearable}
          freeSolo={freeSolo}
          className={css.selectInput}
          filterOptions={filterOptions()}
          {...loadingProps}
          renderInput={renderInput(fieldValue)}
          renderTags={handleRenderTags}
          value={handleMultiSelectValue(fieldValue)}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {optionLabel(option)}
            </li>
          )}
        />
      )}
    />
  );
}

SelectInput.displayName = "SelectInput";

SelectInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    groupBy: PropTypes.string,
    helperText: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired,
  isShow: PropTypes.bool,
  metaInputProps: PropTypes.object,
  options: PropTypes.array
};

export default SelectInput;
