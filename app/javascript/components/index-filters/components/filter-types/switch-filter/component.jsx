import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel
} from "@material-ui/core";
import { useFormContext } from "react-hook-form";

import Panel from "../../panel";
import { useI18n } from "../../../../i18n";
import {
  registerInput,
  handleMoreFiltersChange,
  resetSecondaryFilter
} from "../utils";
import handleFilterChange from "../value-handlers";

import { NAME } from "./constants";

const Component = ({
  filter,
  moreSectionFilters,
  setMoreSectionFilters,
  mode,
  reset,
  setReset
}) => {
  const i18n = useI18n();
  const { register, unregister, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState();
  const valueRef = useRef();
  const { options, field_name: fieldName } = filter;
  // eslint-disable-next-line camelcase
  const label = options?.[i18n.locale]?.[0]?.display_name;

  const handleChange = event => {
    handleFilterChange({
      type: "basic",
      event,
      value: event.target.checked,
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
  };

  const handleReset = () => {
    setValue(fieldName, false);
    resetSecondaryFilter(
      mode?.secondary,
      fieldName,
      getValues()[fieldName],
      moreSectionFilters,
      setMoreSectionFilters
    );
  };

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      setInputValue
    });

    if (
      Object.keys(moreSectionFilters)?.length &&
      Object.keys(moreSectionFilters).includes(fieldName)
    ) {
      setValue(fieldName, true);
      setInputValue(true);
    }

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

  return (
    <Panel
      filter={filter}
      getValues={getValues}
      handleReset={handleReset}
      moreSectionFilters={moreSectionFilters}
    >
      <FormControl>
        <FormGroup>
          <FormControlLabel
            labelPlacement="end"
            control={
              <Switch
                onChange={handleChange}
                checked={Boolean(inputValue) || false}
              />
            }
            label={label}
          />
        </FormGroup>
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
