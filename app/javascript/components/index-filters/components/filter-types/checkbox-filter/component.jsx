// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { FormGroup, FormControlLabel, FormLabel, FormControl, Checkbox } from "@mui/material";

import Panel from "../../panel";
import { getOption } from "../../../../record-form";
import { useI18n } from "../../../../i18n";
import {
  registerInput,
  whichOptions,
  optionText,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "../utils";
import handleFilterChange, { getFilterProps } from "../value-handlers";
import { useMemoizedSelector } from "../../../../../libs";
import useSystemStrings, { FILTER } from "../../../../application/use-system-strings";

import { NAME } from "./constants";

function Component({ filter, moreSectionFilters = {}, setMoreSectionFilters, mode, reset, setReset }) {
  const i18n = useI18n();
  const { label } = useSystemStrings(FILTER);
  const { register, unregister, setValue, user, getValues } = useFormContext();
  const valueRef = useRef();

  const { options, fieldName, optionStringsSource, isObject } = getFilterProps({
    filter,
    user,
    i18n,
    label
  });

  const defaultValue = isObject ? {} : [];

  const [inputValue, setInputValue] = useState(defaultValue);

  const setSecondaryValues = (name, values) => {
    setValue(name, values);
    setInputValue(values);
  };

  const handleReset = () => {
    setValue(fieldName, defaultValue);
    resetSecondaryFilter(mode?.secondary, fieldName, getValues()[fieldName], moreSectionFilters, setMoreSectionFilters);
  };

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      defaultValue,
      setInputValue
    });

    setMoreFilterOnPrimarySection(moreSectionFilters, fieldName, setSecondaryValues);

    if (reset && !mode?.defaultFilter) {
      setValue(fieldName, defaultValue);
      handleReset();
    }

    return () => {
      unregister(fieldName);
      if (setReset) {
        setReset(false);
      }
    };
  }, [register, unregister, fieldName]);

  const lookups = useMemoizedSelector(state => getOption(state, optionStringsSource, i18n.locale));

  const filterOptions = whichOptions({
    optionStringsSource,
    lookups,
    options,
    i18n
  });

  const handleChange = event => {
    handleFilterChange({
      type: isObject ? "objectCheckboxes" : "checkboxes",
      event,
      setInputValue,
      inputValue,
      setValue,
      fieldName
    });

    if (mode?.secondary) {
      handleMoreFiltersChange(moreSectionFilters, setMoreSectionFilters, fieldName, getValues()[fieldName]);
    }
  };

  const renderOptions = () =>
    filterOptions.map(option => {
      return (
        <FormControlLabel
          key={`${fieldName}-${option.id}-form-control`}
          control={
            <Checkbox
              onChange={handleChange}
              value={option.id}
              checked={isObject ? option.key in inputValue : inputValue.includes(String(option.id))}
            />
          }
          label={optionText(option, i18n)}
        />
      );
    });

  return (
    <Panel
      filter={filter}
      getValues={getValues}
      handleReset={handleReset}
      selectedDefaultValueField={isObject ? "or" : null}
    >
      <FormControl component="fieldset">
        <FormLabel component="legend">{i18n.t("cases.status")}</FormLabel>
        <FormGroup>{renderOptions()}</FormGroup>
      </FormControl>
    </Panel>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  filter: PropTypes.object.isRequired,
  mode: PropTypes.shape({
    defaultFilter: PropTypes.bool,
    secondary: PropTypes.bool
  }),
  moreSectionFilters: PropTypes.object,
  reset: PropTypes.bool,
  setMoreSectionFilters: PropTypes.func,
  setReset: PropTypes.func
};

export default Component;
