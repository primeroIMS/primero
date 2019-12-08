import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Panel from "../panel";
import { getOption } from "../../../record-form";
import { useI18n } from "../../../i18n";

import { registerInput, whichOptions } from "./utils";
import handleFilterChange from "./value-handlers";

const SelectFilter = ({ filter }) => {
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
      setInputValue,
      isMultiSelect: true
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

  const optionLabel = option => option?.display_name || option?.display_text;

  return (
    <Panel filter={filter} getValues={getValues}>
      <Autocomplete
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

SelectFilter.displayName = "SelectFilter";

SelectFilter.propTypes = {
  filter: PropTypes.object.isRequired
};

export default SelectFilter;
