// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { TextField, Checkbox, FormControl, FormGroup, FormControlLabel } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { sortBy } from "lodash";

import Panel from "../../panel";
import { useI18n } from "../../../../i18n";
import css from "../styles.css";
import {
  registerInput,
  whichOptions,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "../utils";
import handleFilterChange from "../value-handlers";
import { listboxClasses, virtualize } from "../../../../searchable-select/components/listbox-component";
import useOptions from "../../../../form/use-options";
import { OPTION_TYPES } from "../../../../form/constants";

import { NAME } from "./constants";
import { getOptionName } from "./utils";

function Component({ filter, mode, moreSectionFilters = {}, multiple = true, reset, setMoreSectionFilters, setReset }) {
  const i18n = useI18n();
  const formMethods = useFormContext();
  const valueRef = useRef();
  const {
    options,
    field_name: fieldName,
    option_strings_source: optionStringsSource,
    option_strings_source_id_key: optionStringsSourceIdKey,
    sort_options: sortOptions,
    toggle_include_disabled: toggleIncludeDisabled
  } = filter;

  const lookups = useOptions({
    source: optionStringsSource,
    optionStringsSourceIdKey,
    filterOptions: sourceOptions => sourceOptions.filter(option => !option.disabled),
    includeChildren: optionStringsSource === "Location"
  });

  const [inputValue, setInputValue] = useState([]);
  const [includeDisabledValue, setincludeDisabledValue] = useState(false);

  const filterOptions = whichOptions({
    optionStringsSource,
    lookups,
    options,
    i18n,
    transform: opts => {
      let transformedOptions = opts;

      if (sortOptions) {
        transformedOptions = sortBy(opts, "display_name");
      }

      if (toggleIncludeDisabled && !includeDisabledValue) {
        transformedOptions = transformedOptions.filter(tOpts => tOpts.enabled);
      }

      return transformedOptions;
    }
  });

  const { register, unregister, setValue, getValues } = formMethods;

  const setSecondaryValues = (name, values) => {
    setValue(name, values);
    setInputValue(values);
  };

  const handleReset = () => {
    setValue(fieldName, []);
    resetSecondaryFilter(mode?.secondary, fieldName, getValues()[fieldName], moreSectionFilters, setMoreSectionFilters);
  };

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      defaultValue: [],
      setInputValue,
      isMultiSelect: multiple,
      isLocation: [OPTION_TYPES.LOCATION, OPTION_TYPES.REPORTING_LOCATIONS].includes(optionStringsSource)
    });

    return () => {
      unregister(fieldName);
      if (setReset) {
        setReset(false);
      }
    };
  }, [register, unregister, fieldName, optionStringsSource]);

  useEffect(() => {
    const value = filterOptions.filter(l => moreSectionFilters?.[fieldName]?.includes(l?.code || l?.id));

    setMoreFilterOnPrimarySection(moreSectionFilters, fieldName, setSecondaryValues, value);

    if (reset && !mode?.defaultFilter) {
      handleReset();
    }
  }, [filterOptions.length, fieldName, reset]);

  const handleChange = (event, value) => {
    handleFilterChange({
      type: "basic",
      event,
      value,
      setInputValue,
      inputValue,
      setValue,
      fieldName
    });

    if (mode?.secondary) {
      handleMoreFiltersChange(moreSectionFilters, setMoreSectionFilters, fieldName, getValues()[fieldName]);
    }

    if (filter.onChange) {
      filter.onChange(formMethods, value);
    }
  };

  const optionLabel = option => {
    let foundOption = option;

    if (typeof option === "string") {
      foundOption = filterOptions.find(lookupValue => [lookupValue?.code, lookupValue?.id].includes(option));
    }

    if (!foundOption) {
      return option;
    }

    return getOptionName(foundOption, i18n);
  };

  const handleOptionSelected = (option, value) => {
    if (typeof value === "string") {
      return option.id === value;
    }

    return option.id === value.id;
  };

  const handleToggleDisabledChange = () => {
    setincludeDisabledValue(!includeDisabledValue);
  };

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const handleRenderInput = params => <TextField {...params} fullWidth margin="normal" variant="outlined" />;

  const filterOptionsProp = createFilterOptions({
    matchFrom: "any",
    limit: 50
  });

  return (
    <Panel filter={filter} getValues={getValues} handleReset={handleReset}>
      <Autocomplete
        classes={{ paper: css.paper, root: css.select, ...listboxClasses }}
        ListboxComponent={virtualize(filterOptions.length)}
        disableListWrap
        multiple={multiple}
        getOptionLabel={optionLabel}
        onChange={handleChange}
        options={filterOptions}
        value={inputValue}
        isOptionEqualToValue={handleOptionSelected}
        renderInput={handleRenderInput}
        filterOptions={filterOptionsProp}
        filterSelectedOptions
        data-testid="select-filter"
      />
      {toggleIncludeDisabled && (
        <FormControl>
          <FormGroup>
            <FormControlLabel
              labelPlacement="end"
              control={<Checkbox onChange={handleToggleDisabledChange} checked={includeDisabledValue} />}
              label={i18n.t("cases.filter_by.include_disabled")}
            />
          </FormGroup>
        </FormControl>
      )}
    </Panel>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  addFilterToList: PropTypes.func,
  filter: PropTypes.object.isRequired,
  mode: PropTypes.shape({
    defaultFilter: PropTypes.bool,
    secondary: PropTypes.bool
  }),
  moreSectionFilters: PropTypes.object,
  multiple: PropTypes.bool,
  reset: PropTypes.bool,
  setMoreSectionFilters: PropTypes.func,
  setReset: PropTypes.func
};

export default Component;
