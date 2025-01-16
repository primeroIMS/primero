// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name, react/no-multi-comp */
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { Controller, useWatch } from "react-hook-form";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import { toServerDateFormat } from "../../../libs";
import { useI18n } from "../../i18n";
import localize from "../../../libs/date-picker-localization";
import { useState } from "react";
import "./styles.css";


const DatePicker = ({ commonInputProps, metaInputProps, formMethods }) => {
  const i18n = useI18n();
  const { setValue, control } = formMethods;
  const { name, label, helperText, error, disabled, placeholder } = commonInputProps;
  const [selectedDate, setSelectedDate] = useState(null);
  const currentValue = useWatch({ name, control });

  const { dateIncludeTime } = metaInputProps;

  const handleChange = date => {
    setValue(name, date ? toServerDateFormat(date, { includeTime: dateIncludeTime }) : "", { shouldDirty: true });
    setSelectedDate(date);
    return date;
  };

  const datePickerProps = {
    variant: "inline",
    format: "dd-MMM-yyyy",
    margin: "normal",
    label: label,
    value: selectedDate,
    onChange: handleChange,
    maxDate: new Date(), // Allow customization of maxDate    
    KeyboardButtonProps: {
      "aria-label": i18n.t("key_performance_indicators.date_range_dialog.aria-labels.to")
    }
  };

  const renderPicker = () => {
    return <KeyboardDatePicker {...datePickerProps} />
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localize(i18n)}>
      <Controller
        control={control}
        as={renderPicker}
        {...commonInputProps}
        helperText={<>{helperText}</>}
        defaultValue=""
      />
    </MuiPickersUtilsProvider>
  );
};

DatePicker.defaultProps = {
  metaInputProps: {}
};

DatePicker.displayName = "DatePicker";

DatePicker.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object,
  formMode: PropTypes.object
};

export default DatePicker;
