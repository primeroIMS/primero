import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";

import Panel from "../panel";
import { getOption, getLocations } from "../../../record-form";
import { useI18n } from "../../../i18n";

import styles from "./styles.css";
import {
  registerInput,
  whichOptions,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "./utils";
import handleFilterChange from "./value-handlers";

const SelectFilter = ({
  filter,
  moreSectionFilters,
  setMoreSectionFilters,
  isSecondary
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

  const lookup = useSelector(state =>
    getOption(state, optionStringsSource, i18n.locale)
  );

  const locations = useSelector(state =>
    getLocations(state, optionStringsSource, i18n.locale)
  );

  const lookups = ["location", "reporting_location"].includes(
    optionStringsSource
  )
    ? locations?.toJS()
    : lookup;

  const setSecondaryValues = (name, values) => {
    setValue(name, values);
    setInputValue(values);
  };

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      defaultValue: [],
      setInputValue,
      isMultiSelect: true
    });

    const value = lookups.filter(l =>
      moreSectionFilters?.[fieldName]?.includes(l?.id)
    );

    setMoreFilterOnPrimarySection(
      moreSectionFilters,
      fieldName,
      setSecondaryValues,
      value
    );

    return () => {
      unregister(fieldName);
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

    if (isSecondary) {
      handleMoreFiltersChange(
        moreSectionFilters,
        setMoreSectionFilters,
        fieldName,
        getValues()[fieldName]
      );
    }
  };

  const handleReset = () => {
    setValue(fieldName, []);
    resetSecondaryFilter(
      isSecondary,
      fieldName,
      getValues()[fieldName],
      moreSectionFilters,
      setMoreSectionFilters
    );
  };

  const optionLabel = option => {
    let foundOption = option;

    if (typeof option === "string") {
      [foundOption] = lookups.filter(l => l?.id === option);
    }

    return (
      foundOption?.display_name?.[i18n.locale] ||
      foundOption?.display_text?.[i18n.locale] ||
      foundOption?.name?.[i18n.locale]
    );
  };

  return (
    <Panel filter={filter} getValues={getValues} handleReset={handleReset}>
      <Autocomplete
        classes={{ root: css.select }}
        multiple
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

SelectFilter.defaultProps = {
  moreSectionFilters: {}
};

SelectFilter.displayName = "SelectFilter";

SelectFilter.propTypes = {
  filter: PropTypes.object.isRequired,
  isSecondary: PropTypes.bool,
  moreSectionFilters: PropTypes.object,
  setMoreSectionFilters: PropTypes.func
};

export default SelectFilter;
