// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { endOfDay, startOfDay } from "date-fns";

import { DATE_FORMAT, DATE_TIME_FORMAT, LOCALE_KEYS } from "../../../../../config";
import { useI18n } from "../../../../i18n";
import { toServerDateFormat } from "../../../../../libs";
import localize from "../../../../../libs/date-picker-localization";
import NepaliCalendar from "../../../../nepali-calendar-input";
import css from "../styles.css";

import { getDatesValue, getDateValue } from "./utils";

const Component = ({
  dateIncludeTime,
  inputValue,
  mode,
  moreSectionFilters,
  selectedField,
  setInputValue,
  setMoreSectionFilters,
  setValue,
  register
}) => {
  const i18n = useI18n();
  const pickerFormat = dateIncludeTime ? DATE_TIME_FORMAT : DATE_FORMAT;

  useEffect(() => {
    if (selectedField) {
      register(selectedField);
    }

    return () => {
      if (selectedField) {
        setValue(selectedField, null);
      }
    };
  }, [selectedField]);

  const handleDatePicker = (field, date) => {
    let formattedDate = date;

    if (date) {
      const dateValue = field === "to" ? endOfDay(date) : startOfDay(date);

      formattedDate = toServerDateFormat(dateIncludeTime ? date : dateValue, {
        includeTime: true,
        normalize: dateIncludeTime === true
      });
    }

    const value = { ...getDatesValue(inputValue), [field]: formattedDate };

    setInputValue(value);

    if (selectedField) {
      setValue(selectedField, value);
    }

    if (mode?.secondary) {
      setMoreSectionFilters({ ...moreSectionFilters, [selectedField]: value });
    }
  };

  const onChange = picker => date => handleDatePicker(picker, date);

  return ["from", "to"].map(picker => {
    const inputProps = {
      fullWidth: true,
      margin: "normal",
      format: pickerFormat,
      label: i18n.t(`fields.date_range.${picker}`),
      value: getDateValue(picker, inputValue, dateIncludeTime),
      onChange: onChange(picker),
      disabled: !selectedField,
      clearLabel: i18n.t("buttons.clear"),
      cancelLabel: i18n.t("buttons.cancel"),
      okLabel: i18n.t("buttons.ok")
    };

    if (i18n.locale === LOCALE_KEYS.ne) {
      return <NepaliCalendar label={inputProps.label} dateProps={inputProps} />;
    }

    return (
      <div key={picker} className={css.dateInput}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localize(i18n)}>
          {dateIncludeTime ? <DateTimePicker {...inputProps} /> : <DatePicker {...inputProps} />}
        </MuiPickersUtilsProvider>
      </div>
    );
  });
};

Component.displayName = "DatePickers";

export default Component;
