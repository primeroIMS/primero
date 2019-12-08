import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { Select, MenuItem } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../../i18n";
import styles from "../styles.css";
import Panel from "../panel";

import { registerInput } from "./utils";

const DateFilter = ({ filter }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { register, unregister, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState();
  const valueRef = useRef();
  const { options } = filter;
  const isDateFieldSelectable = Object.keys?.(options)?.length > 0;
  const valueSelectedField = options[i18n.locale].filter(option =>
    Object.keys(getValues({ nest: true })).includes(option.id)
  )?.[0]?.id;
  const [selectedField, setSelectedField] = useState(valueSelectedField || "");

  const handleDatePicker = (field, date) => {
    const value = { ...inputValue, [field]: date };

    setInputValue(value);
    setValue(selectedField, value);
  };

  const handleSelectedField = event => {
    const { value } = event.target;

    if (selectedField) {
      unregister(selectedField);
    }

    setSelectedField(value);
  };

  useEffect(() => {
    if (selectedField) {
      registerInput({
        register,
        name: selectedField,
        ref: valueRef,
        setInputValue,
        clearSecondaryInput: () => setSelectedField("")
      });
    }

    return () => {
      if (selectedField) {
        unregister(selectedField);
      }
    };
  }, [register, unregister, selectedField, valueRef]);

  const renderSelectOptions = () =>
    options?.[i18n.locale].map(option => (
      <MenuItem value={option.id}>{option.display_name}</MenuItem>
    ));

  return (
    <Panel
      filter={filter}
      getValues={getValues}
      selectedDefaultValueField={selectedField}
    >
      {isDateFieldSelectable && (
        <Select value={selectedField} onChange={handleSelectedField}>
          {renderSelectOptions()}
        </Select>
      )}
      <DatePicker
        margin="normal"
        format="dd-MMM-yyyy"
        label={i18n.t(`fields.date_range.from`)}
        value={inputValue?.from}
        onChange={date => handleDatePicker("from", date)}
        disabled={!selectedField}
      />
      <DatePicker
        margin="normal"
        format="dd-MMM-yyyy"
        label={i18n.t(`fields.date_range.to`)}
        value={inputValue?.to}
        onChange={date => handleDatePicker("to", date)}
        disabled={!selectedField}
      />
    </Panel>
  );
};

DateFilter.propTypes = {
  filter: PropTypes.object.isRequired
};

DateFilter.displayName = "DateFilter";

export default DateFilter;
