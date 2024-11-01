// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import qs from "qs";

import { useI18n } from "../../../../i18n";
import Panel from "../../panel";
import css from "../styles.css";
import { handleMoreFiltersChange, resetSecondaryFilter, setMoreFilterOnPrimarySection } from "../utils";

import FieldSelect from "./field-select";
import DatePickers from "./date-pickers";
import { getDatesValue } from "./utils";
import { NAME } from "./constants";

function Component({ filter, mode, moreSectionFilters = {}, setMoreSectionFilters, reset, setReset }) {
  const i18n = useI18n();

  const { register, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState();
  const { options, field_name: fieldName, dateIncludeTime } = filter;
  const isDateFieldSelectable = Object.keys?.(options)?.length > 0;
  const valueSelectedField = options?.[i18n.locale]?.filter(option =>
    Object.keys(getValues({ nest: true })).includes(option.id)
  )?.[0]?.id;
  const [selectedField, setSelectedField] = useState(valueSelectedField || "");
  const location = useLocation();
  const queryString = location.search.replace("?", "");
  const queryParams = useMemo(() => qs.parse(queryString), [queryString]);
  const queryParamsKeys = useMemo(() => Object.keys(queryParams), [queryString]);

  const setSecondaryValues = (name, values) => {
    setValue(name, getDatesValue(values, dateIncludeTime));
    setInputValue(getDatesValue(values, dateIncludeTime));
  };

  const handleSelectedField = event => {
    const { value } = event.target;

    setSelectedField(value);
    setSecondaryValues(value, inputValue);

    if (mode?.secondary) {
      handleMoreFiltersChange(moreSectionFilters, setMoreSectionFilters, value, {});
    }
  };

  const handleReset = () => {
    if (selectedField) {
      setSelectedField("");
      setValue(selectedField, getDatesValue(undefined, dateIncludeTime));

      resetSecondaryFilter(
        mode?.secondary,
        selectedField,
        getValues()[fieldName],
        moreSectionFilters,
        setMoreSectionFilters
      );
    }
  };

  useEffect(() => {
    if (selectedField) {
      if (reset && !mode?.defaultFilter) {
        handleReset();
      }

      setMoreFilterOnPrimarySection(moreSectionFilters, selectedField, setSecondaryValues);
    } else if (queryParamsKeys.length && !Object.keys(moreSectionFilters).length) {
      const data = filter?.options?.[i18n.locale].find(option => queryParamsKeys.includes(option.id));
      const selectValue = data?.id;
      const datesValue = queryParams?.[selectValue];

      setSelectedField(selectValue);
      setInputValue(getDatesValue(datesValue, dateIncludeTime));
    }

    return () => {
      if (selectedField) {
        if (setReset) {
          setReset(false);
        }
      }
    };
  }, [selectedField, queryParams]);

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
          <FieldSelect
            options={options?.[i18n.locale] || []}
            selectedField={selectedField}
            handleSelectedField={handleSelectedField}
          />
        )}
        <DatePickers
          dateIncludeTime={dateIncludeTime}
          inputValue={inputValue}
          mode={mode}
          moreSectionFilters={moreSectionFilters}
          selectedField={selectedField}
          setInputValue={setInputValue}
          setMoreSectionFilters={setMoreSectionFilters}
          setValue={setValue}
          register={register}
        />
      </div>
    </Panel>
  );
}

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
