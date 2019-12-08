import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import Panel from "../panel";
import { getOption } from "../../../record-form";
import { useI18n } from "../../../i18n";

import { registerInput, whichOptions } from "./utils";
import handleFilterChange, { valueParser } from "./value-handlers";

const ToggleFilter = ({ filter }) => {
  const i18n = useI18n();
  const { register, unregister, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState([]);
  const valueRef = useRef();
  const {
    options,
    field_name: fieldName,
    option_strings_source: optionStringsSource
  } = filter;

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

  const handleChange = (event, value) =>
    handleFilterChange({
      type: "basic",
      event,
      value,
      setInputValue,
      inputValue,
      setValue,
      fieldName
    });

  const renderOptions = () =>
    filterOptions.map(option => {
      const { display_name: displayName, display_text: displayText } = option;
      const optionValue = valueParser(fieldName, option.id);

      return (
        <ToggleButton key={`${fieldName}-${option.id}`} value={optionValue}>
          {displayText || displayName}
        </ToggleButton>
      );
    });

  return (
    <Panel filter={filter} getValues={getValues}>
      <ToggleButtonGroup
        value={inputValue}
        onChange={handleChange}
        size="small"
      >
        {renderOptions()}
      </ToggleButtonGroup>
    </Panel>
  );
};

ToggleFilter.displayName = "ToggleFilter";

ToggleFilter.propTypes = {
  filter: PropTypes.object.isRequired
};

export default ToggleFilter;
