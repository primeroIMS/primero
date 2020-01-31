import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { Select, MenuItem } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import { useLocation } from "react-router-dom";
import qs from "qs";

import { useI18n } from "../../../../i18n";
import Panel from "../../panel";
import styles from "../styles.css";
import {
  registerInput,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "../utils";

import { NAME } from "./constants";

const Component = ({
  filter,
  mode,
  moreSectionFilters,
  setMoreSectionFilters,
  reset,
  setReset
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { register, unregister, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState();
  const valueRef = useRef();
  const { options, field_name: fieldName } = filter;
  const isDateFieldSelectable = Object.keys?.(options)?.length > 0;
  const valueSelectedField = options?.[i18n.locale]?.filter(option =>
    Object.keys(getValues({ nest: true })).includes(option.id)
  )?.[0]?.id;
  const [selectedField, setSelectedField] = useState(valueSelectedField || "");
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));

  const handleDatePicker = (field, date) => {
    const value = { ...inputValue, [field]: date };

    setInputValue(value);
    setValue(selectedField, value);

    if (mode?.secondary) {
      setMoreSectionFilters({ ...moreSectionFilters, [selectedField]: value });
    }
  };

  const handleSelectedField = event => {
    const { value } = event.target;

    if (selectedField) {
      unregister(selectedField);
    }

    setSelectedField(value);
    // setInputValue({});

    if (mode?.secondary) {
      setMoreSectionFilters({ ...moreSectionFilters, [value]: {} });
    }
  };

  const handleReset = () => {
    if (selectedField) {
      setSelectedField("");
      setValue(selectedField, undefined);

      resetSecondaryFilter(
        mode?.secondary,
        selectedField,
        getValues()[fieldName],
        moreSectionFilters,
        setMoreSectionFilters
      );
    }
  };

  const setSecondaryValues = (name, values) => {
    setValue(name, values);
    setInputValue(values);
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

      if (reset && !mode?.defaultFilter) {
        handleReset();
      }

      setMoreFilterOnPrimarySection(
        moreSectionFilters,
        selectedField,
        setSecondaryValues
      );
    } else if (
      Object.keys(queryParams).length &&
      !Object.keys(moreSectionFilters).length
    ) {
      // WHEN IT COMES FROM SAVED SEARCHES OR DASHBOARDS
      const data = filter?.options?.[i18n.locale].find(option =>
        Object.keys(queryParams).includes(option.id)
      );
      const selectValue = data?.id;
      const datesValue = queryParams?.[selectValue];

      // SET SELECT VALUE
      setSelectedField(selectValue);
      // SET DATES VALUES
      setInputValue(datesValue);
      // // SET FORM VALUE
      // setValue(selectValue, datesValue);
    }

    return () => {
      if (selectedField) {
        unregister(selectedField);
        if (setReset) {
          setReset(false);
        }
      }
    };
  }, [register, unregister, selectedField, valueRef]);

  const renderSelectOptions = () =>
    options?.[i18n.locale]?.map(option => (
      <MenuItem value={option.id} key={option.id}>
        {option.display_name}
      </MenuItem>
    ));

  return (
    <Panel
      filter={filter}
      getValues={getValues}
      selectedDefaultValueField={selectedField}
      handleReset={handleReset}
      moreSectionFilters={moreSectionFilters}
    >
      <div className={css.dateContainer}>
        {" "}
        {isDateFieldSelectable && (
          <div className={css.dateInput}>
            <Select
              fullWidth
              value={selectedField}
              onChange={handleSelectedField}
              variant="outlined"
            >
              {renderSelectOptions()}
            </Select>
          </div>
        )}
        <div className={css.dateInput}>
          <DatePicker
            margin="normal"
            format="dd-MMM-yyyy"
            label={i18n.t(`fields.date_range.from`)}
            value={inputValue?.from}
            onChange={date => handleDatePicker("from", date)}
            disabled={!selectedField}
            fullWidth
          />
        </div>
        <div className={css.dateInput}>
          <DatePicker
            fullWidth
            margin="normal"
            format="dd-MMM-yyyy"
            label={i18n.t(`fields.date_range.to`)}
            value={inputValue?.to}
            onChange={date => handleDatePicker("to", date)}
            disabled={!selectedField}
          />
        </div>
      </div>
    </Panel>
  );
};

Component.defaultProps = {
  moreSectionFilters: {}
};

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

Component.displayName = NAME;

export default Component;
