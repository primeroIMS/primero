import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel
} from "@material-ui/core";
import { useFormContext } from "react-hook-form";

import Panel from "../panel";
import { useI18n } from "../../../i18n";

import { registerInput } from "./utils";
import handleFilterChange from "./value-handlers";

const SwitchFilter = ({ filter }) => {
  const i18n = useI18n();
  const { register, unregister, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState();
  const valueRef = useRef();
  const { options, field_name: fieldName } = filter;
  const label = options?.[i18n.locale]?.[0]?.display_name;

  const handleChange = event =>
    handleFilterChange({
      type: "basic",
      event,
      value: event.target.checked,
      setInputValue,
      inputValue,
      setValue,
      fieldName
    });

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      setInputValue
    });

    return () => {
      unregister(fieldName);
    };
  }, [register, unregister, fieldName]);

  return (
    <Panel filter={filter} getValues={getValues}>
      <FormControl>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch onChange={handleChange} checked={inputValue || false} />
            }
            label={label}
          />
        </FormGroup>
      </FormControl>
    </Panel>
  );
};

SwitchFilter.displayName = "SwitchFilter";

SwitchFilter.propTypes = {
  filter: PropTypes.object.isRequired
};

export default SwitchFilter;
