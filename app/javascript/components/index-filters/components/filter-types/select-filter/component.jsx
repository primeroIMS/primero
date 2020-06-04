import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";
import { useLocation } from "react-router-dom";
import qs from "qs";

import Panel from "../../panel";
import { getOption, getLocations } from "../../../../record-form";
import { useI18n } from "../../../../i18n";
import styles from "../styles.css";
import {
  registerInput,
  whichOptions,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "../utils";
import handleFilterChange from "../value-handlers";

import { NAME } from "./constants";

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
  const css = makeStyles(styles)();
  const { register, unregister, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState([]);
  const valueRef = useRef();
  const {
    options,
    field_name: fieldName,
    option_strings_source: optionStringsSource
  } = filter;
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));

  const lookup = useSelector(state =>
    getOption(state, optionStringsSource, i18n.locale)
  );

  const locations = useSelector(state =>
    getLocations(state, optionStringsSource === "Location")
  );

  const lookups = ["Location"].includes(optionStringsSource)
    ? locations?.toJS()
    : lookup;

  const setSecondaryValues = (name, values) => {
    setValue(name, values);
    setInputValue(values);
  };

  const handleReset = () => {
    setValue(fieldName, []);
    resetSecondaryFilter(
      mode?.secondary,
      fieldName,
      getValues()[fieldName],
      moreSectionFilters,
      setMoreSectionFilters
    );

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

    const value = lookups.filter(l =>
      moreSectionFilters?.[fieldName]?.includes(l?.code || l?.id)
    );

    setMoreFilterOnPrimarySection(
      moreSectionFilters,
      fieldName,
      setSecondaryValues,
      value
    );

    if (reset && !mode?.defaultFilter) {
      handleReset();
    }

    if (Object.keys(queryParams).length) {
      const paramValues = queryParams[fieldName];

      if (paramValues?.length) {
        const selected = lookups.filter(l =>
          paramValues.includes(l?.code?.toString() || l?.id?.toString())
        );

        setValue(fieldName, selected);
        setInputValue(selected);
      }
    }

    return () => {
      unregister(fieldName);
      if (setReset) {
        setReset(false);
      }
    };
  }, [register, unregister, fieldName]);

  const filterOptions = whichOptions({
    optionStringsSource,
    lookups,
    options,
    i18n
  });

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
      handleMoreFiltersChange(
        moreSectionFilters,
        setMoreSectionFilters,
        fieldName,
        getValues()[fieldName]
      );
    }

    if (addFilterToList) {
      addFilterToList({ [fieldName]: getValues()[fieldName] || undefined });
    }
  };

  const optionLabel = option => {
    let foundOption = option;

    if (typeof option === "string") {
      [foundOption] = lookups.filter(lookupValue =>
        [lookupValue?.code, lookupValue?.id].includes(option)
      );
    }

    return (
      // eslint-disable-next-line camelcase
      foundOption?.display_name ||
      // eslint-disable-next-line camelcase
      foundOption?.display_text ||
      // eslint-disable-next-line camelcase
      foundOption?.display_name?.[i18n.locale] ||
      // eslint-disable-next-line camelcase
      foundOption?.display_text?.[i18n.locale] ||
      foundOption?.name?.[i18n.locale]
    );
  };

  return (
    <Panel filter={filter} getValues={getValues} handleReset={handleReset}>
      <Autocomplete
        classes={{ root: css.select }}
        multiple={multiple}
        getOptionLabel={optionLabel}
        onChange={handleChange}
        options={filterOptions}
        value={inputValue}
        getOptionSelected={(option, value) => option.id === value.id}
        renderInput={params => (
          <TextField {...params} fullWidth margin="normal" variant="outlined" />
        )}
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
