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

import Panel from "../panel";
import { getOption } from "../../../record-form";
import { useI18n } from "../../../i18n";

import { registerInput, whichOptions } from "./utils";
import handleFilterChange, { getFilterProps } from "./value-handlers";

const CheckboxFilter = ({ filter }) => {
  const i18n = useI18n();
  const { register, unregister, setValue, user, getValues } = useFormContext();
  const valueRef = useRef();
  const [inputValue, setInputValue] = useState([]);
  const { options, fieldName, optionStringsSource } = getFilterProps({
    filter,
    user,
    i18n
  });

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      defaultValue: [],
      setInputValue
    });

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

  const handleChange = event =>
    handleFilterChange({
      type: "checkboxes",
      event,
      setInputValue,
      inputValue,
      setValue,
      fieldName
    });

  const renderOptions = () =>
    filterOptions.map(option => {
      const { display_name: displayName, display_text: displayText } = option;

      return (
        <FormControlLabel
          key={`${fieldName}-${option.id}`}
          control={
            <Checkbox
              onChange={handleChange}
              value={option.id}
              checked={inputValue.includes(option.id)}
            />
          }
          label={displayText || displayName}
        />
      );
    });

  return (
    <Panel filter={filter} getValues={getValues}>
      <FormControl component="fieldset">
        <FormGroup>{renderOptions()}</FormGroup>
      </FormControl>
    </Panel>
  );
};

CheckboxFilter.displayName = "CheckboxFilter";

CheckboxFilter.propTypes = {
  filter: PropTypes.object.isRequired
};

export default CheckboxFilter;
