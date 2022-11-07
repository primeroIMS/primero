import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { TextField } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { useLocation } from "react-router-dom";
import qs from "qs";

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
import { OPTION_TYPES } from "../../../../form";

import { NAME } from "./constants";
import { getOptionName } from "./utils";

const Component = ({
  addFilterToList,
  filter,
  mode,
  moreSectionFilters,
  multiple,
  reset,
  setMoreSectionFilters,
  setReset
}) => {
  const i18n = useI18n();

  const formMethods = useFormContext();
  const { register, unregister, setValue, getValues } = formMethods;
  const [inputValue, setInputValue] = useState([]);
  const valueRef = useRef();
  const {
    options,
    field_name: fieldName,
    option_strings_source: optionStringsSource,
    option_strings_source_id_key: optionStringsSourceIdKey
  } = filter;
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));

  const lookups = useOptions({
    source: optionStringsSource,
    optionStringsSourceIdKey,
    filterOptions: sourceOptions => sourceOptions.filter(option => !option.disabled),
    includeChildren: optionStringsSource === "Location"
  });

  const filterOptions = whichOptions({
    optionStringsSource,
    lookups,
    options,
    i18n
  });

  const setSecondaryValues = (name, values) => {
    setValue(name, values);
    setInputValue(values);
  };

  const handleReset = () => {
    setValue(fieldName, []);
    resetSecondaryFilter(mode?.secondary, fieldName, getValues()[fieldName], moreSectionFilters, setMoreSectionFilters);

    if (addFilterToList) {
      addFilterToList({ [fieldName]: undefined });
    }
  };

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      defaultValue: [],
      setInputValue,
      isMultiSelect: multiple
    });

    return () => {
      unregister(fieldName);
      if (setReset) {
        setReset(false);
      }
    };
  }, [register, unregister, fieldName]);

  useEffect(() => {
    const value = filterOptions.filter(l => moreSectionFilters?.[fieldName]?.includes(l?.code || l?.id));

    setMoreFilterOnPrimarySection(moreSectionFilters, fieldName, setSecondaryValues, value);

    if (reset && !mode?.defaultFilter) {
      handleReset();
    }

    if (Object.keys(queryParams).length) {
      const paramValues = [OPTION_TYPES.LOCATION, OPTION_TYPES.REPORTING_LOCATIONS].includes(optionStringsSource)
        ? queryParams[fieldName]?.map(paramValue => paramValue.toUpperCase())
        : queryParams[fieldName];

      if (paramValues?.length) {
        const selected = filterOptions.filter(filterOption =>
          paramValues.includes(filterOption?.code?.toString() || filterOption?.id?.toString())
        );

        setValue(fieldName, selected);
        setInputValue(selected);
      }
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

    if (addFilterToList) {
      addFilterToList({ [fieldName]: getValues()[fieldName] || undefined });
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

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const handleRenderInput = params => <TextField {...params} fullWidth margin="normal" variant="outlined" />;

  const filterOptionsProp = createFilterOptions({
    matchFrom: "any",
    limit: 50
  });

  return (
    <Panel filter={filter} getValues={getValues} handleReset={handleReset}>
      <Autocomplete
        classes={{ root: css.select, ...listboxClasses }}
        ListboxComponent={virtualize(filterOptions.length)}
        disableListWrap
        multiple={multiple}
        getOptionLabel={optionLabel}
        onChange={handleChange}
        options={filterOptions}
        value={inputValue}
        getOptionSelected={handleOptionSelected}
        renderInput={handleRenderInput}
        filterOptions={filterOptionsProp}
      />
    </Panel>
  );
};

Component.defaultProps = {
  moreSectionFilters: {},
  multiple: true
};

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
