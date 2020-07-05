import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { Chip, Checkbox } from "@material-ui/core";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";

import Panel from "../../panel";
import { getOption } from "../../../../record-form";
import { useI18n } from "../../../../i18n";
import styles from "../styles.css";
import {
  registerInput,
  whichOptions,
  optionText,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "../utils";
import handleFilterChange from "../value-handlers";

import { NAME } from "./constants";

const Component = ({
  addFilterToList,
  filter,
  moreSectionFilters,
  setMoreSectionFilters,
  mode,
  reset,
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

  const whichColor = (value, outlined) => {
    switch (value) {
      case "high":
        return outlined ? css.redChipOutlined : css.redChip;
      case "medium":
        return outlined ? css.orangeChipOutlined : css.orangeChip;
      case "low":
        return outlined ? css.yellowChipOutlined : css.yellowChip;
      default:
        return "";
    }
  };

  const filterOptions = whichOptions({
    optionStringsSource,
    lookups,
    options,
    i18n
  });

  const handleChange = event => {
    handleFilterChange({
      type: "checkboxes",
      event,
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

  const renderOptions = () =>
    filterOptions.map(option => {
      const optionTxt = optionText(option, i18n);

      return (
        <Checkbox
          key={`${fieldName}-${option.id}`}
          onChange={handleChange}
          checked={inputValue.includes(option.id)}
          value={option.id}
          disableRipple
          classes={{ colorSecondary: css.chips }}
          icon={
            <Chip
              size="small"
              label={optionTxt}
              variant="outlined"
              classes={{ root: whichColor(option.id, true) }}
            />
          }
          checkedIcon={
            <Chip
              size="small"
              label={optionTxt}
              classes={{ root: whichColor(option.id) }}
            />
          }
        />
      );
    });

  return (
    <Panel filter={filter} getValues={getValues} handleReset={handleReset}>
      <div className={css.chipsContainer}>{renderOptions()}</div>
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
