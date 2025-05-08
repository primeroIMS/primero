// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { isString } from "formik";

import { DATE_FORMAT, DATE_TIME_FORMAT, LOCALE_KEYS } from "../../../../../config";
import { useI18n } from "../../../../i18n";
import { toServerDateFormat } from "../../../../../libs";
import NepaliCalendar from "../../../../nepali-calendar-input";
import css from "../styles.css";
import DateProvider from "../../../../../date-provider";
import { dayOfWeekFormatter } from "../../../../../libs/date-picker-localization";

import { getDatesValue, getDateValue } from "./utils";

function Component({
  dateIncludeTime,
  inputValue,
  mode,
  moreSectionFilters,
  selectedField,
  setInputValue,
  setMoreSectionFilters,
  setValue,
  register
}) {
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
    const label = i18n.t(`fields.date_range.${picker}`);
    const dateValue = getDateValue(picker, inputValue, dateIncludeTime);
    const parsedDateValue = isString(dateValue) ? parseISO(dateValue) : dateValue;

    const inputProps = {
      fullWidth: true,
      margin: "normal",
      format: pickerFormat,
      label,
      value: parsedDateValue,
      onChange: onChange(picker),
      disabled: !selectedField,
      clearLabel: i18n.t("buttons.clear"),
      cancelLabel: i18n.t("buttons.cancel"),
      okLabel: i18n.t("buttons.ok"),
      slotProps: {
        actionBar: {
          actions: ["clear", "accept"]
        },
        textField: { InputLabelProps: { shrink: true }, fullWidth: true, clearable: true }
      }
    };

    if (i18n.locale === LOCALE_KEYS.ne) {
      return <NepaliCalendar label={label} dateProps={inputProps} />;
    }

    const DateComponent = dateIncludeTime ? DateTimePicker : DatePicker;

    return (
      <div key={picker} className={css.dateInput}>
        <DateProvider>
          <DateComponent {...inputProps} dayOfWeekFormatter={dayOfWeekFormatter(i18n)} />
        </DateProvider>
      </div>
    );
  });
}

Component.displayName = "DatePickers";

export default Component;
