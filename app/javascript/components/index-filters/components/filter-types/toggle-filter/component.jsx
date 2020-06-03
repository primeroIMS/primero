import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { makeStyles } from "@material-ui/styles";
import isEmpty from "lodash/isEmpty";

import Panel from "../../panel";
import { getOption } from "../../../../record-form";
import { useI18n } from "../../../../i18n";
import styles from "../styles.css";
import {
  registerInput,
  whichOptions,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "../utils";
import handleFilterChange, { valueParser } from "../value-handlers";

import { NAME } from "./constants";

const Component = ({
  addFilterToList,
  filter,
  mode,
  moreSectionFilters,
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
      setInputValue
    });

    setMoreFilterOnPrimarySection(
      moreSectionFilters,
      fieldName,
      setSecondaryValues
    );

    if (reset && !mode?.defaultFilter) {
      handleReset();
    }

    return () => {
      unregister(fieldName);
      if (setReset) {
        setReset(false);
      }
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
      addFilterToList({ [fieldName]: !isEmpty(value) ? value : [] });
    }
  };

  const renderOptions = () =>
    filterOptions.map(option => {
      const { display_name: displayName, display_text: displayText } = option;
      const optionValue = valueParser(fieldName, option.id);

      return (
        <ToggleButton
          key={`${fieldName}-${option.id}`}
          value={optionValue}
          classes={{
            root: css.toggleButton,
            selected: css.toggleButtonSelected
          }}
        >
          {displayText || displayName}
        </ToggleButton>
      );
    });

  return (
    <Panel filter={filter} getValues={getValues} handleReset={handleReset}>
      <ToggleButtonGroup
        color="primary"
        value={inputValue}
        onChange={handleChange}
        size="small"
        classes={{ root: css.toggleContainer }}
      >
        {renderOptions()}
      </ToggleButtonGroup>
    </Panel>
  );
};

Component.defaultProps = {
  moreSectionFilters: {}
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
  reset: PropTypes.bool,
  setMoreSectionFilters: PropTypes.func,
  setReset: PropTypes.func
};

export default Component;
