import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { Chip, Checkbox } from "@material-ui/core";
import { useSelector } from "react-redux";

import Panel from "../panel";
import { getOption } from "../../../record-form";
import { useI18n } from "../../../i18n";

import { registerInput, whichOptions } from "./utils";
import handleFilterChange from "./value-handlers";

const ChipsFilter = ({ filter }) => {
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
        <Checkbox
          key={`${fieldName}-${option.id}`}
          onChange={handleChange}
          checked={inputValue.includes(option.id)}
          value={option.id}
          disableRipple
          icon={
            <Chip
              size="small"
              label={displayText || displayName}
              variant="outlined"
            />
          }
          checkedIcon={<Chip size="small" label={displayText || displayName} />}
        />
      );
    });

  return (
    <Panel filter={filter} getValues={getValues}>
      {renderOptions()}
    </Panel>
  );
};

ChipsFilter.displayName = "ChipsFilter";

ChipsFilter.propTypes = {
  filter: PropTypes.object.isRequired
};

export default ChipsFilter;
