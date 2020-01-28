import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  Checkbox
} from "@material-ui/core";
import { useSelector } from "react-redux";

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

import { NAME } from "./constants";

const Component = ({
  filter,
  moreSectionFilters,
  setMoreSectionFilters,
  isSecondary
}) => {
  const i18n = useI18n();
  const { register, unregister, setValue, user, getValues } = useFormContext();
  const valueRef = useRef();
  const { options, fieldName, optionStringsSource, isObject } = getFilterProps({
    filter,
    user,
    i18n
  });

  const defaultValue = isObject ? {} : [];

  const [inputValue, setInputValue] = useState(defaultValue);

  const setSecondaryValues = (name, values) => {
    setValue(name, values);
    setInputValue(values);
  };

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      defaultValue,
      setInputValue
    });

    setMoreFilterOnPrimarySection(
      moreSectionFilters,
      fieldName,
      setSecondaryValues
    );

    return () => {
      unregister(fieldName);
    };
  }, [register, unregister, fieldName]);

  const lookups = useSelector(state =>
    getOption(state, optionStringsSource, i18n.locale)
  );

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
    setValue(fieldName, defaultValue);
    resetSecondaryFilter(
      isSecondary,
      fieldName,
      getValues()[fieldName],
      moreSectionFilters,
      setMoreSectionFilters
    );
  };

  const renderOptions = () =>
    filterOptions.map(option => {
      return (
        <FormControlLabel
          key={`${fieldName}-${option.id}`}
          control={
            <Checkbox
              onChange={handleChange}
              value={option.id}
              checked={
                isObject
                  ? option.key in inputValue
                  : inputValue.includes(option.id)
              }
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
        <FormGroup>{renderOptions()}</FormGroup>
      </FormControl>
    </Panel>
  );
};

Component.defaultProps = {
  moreSectionFilters: {}
};

Component.displayName = NAME;

Component.propTypes = {
  filter: PropTypes.object.isRequired,
  isSecondary: PropTypes.bool,
  moreSectionFilters: PropTypes.object,
  setMoreSectionFilters: PropTypes.func
};

export default Component;
