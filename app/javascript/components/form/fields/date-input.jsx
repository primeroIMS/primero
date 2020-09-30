/* eslint-disable react/display-name, react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { parseISO } from "date-fns";
import isEmpty from "lodash/isEmpty";

import { toServerDateFormat } from "../../../libs";
import { useI18n } from "../../i18n";
import localize from "../../../libs/date-picker-localization";

const DateInput = ({ commonInputProps, metaInputProps }) => {
  const i18n = useI18n();
  const { setValue, watch } = useFormContext();
  const { name } = commonInputProps;
  const fieldValue = watch(name);

  const { dateIncludeTime } = metaInputProps;

  const getDateValue = value => {
    if (isEmpty(value)) {
      return value;
    }

    return dateIncludeTime ? parseISO(value) : parseISO(value.slice(0, 10));
  };

  const handleChange = date => {
    setValue(name, date ? toServerDateFormat(date, { includeTime: dateIncludeTime }) : "");

    return date;
  };

  const renderPicker = () => {
    if (dateIncludeTime) {
      return <DateTimePicker {...commonInputProps} onChange={handleChange} value={getDateValue(fieldValue)} />;
    }

    return <DatePicker {...commonInputProps} onChange={handleChange} value={getDateValue(fieldValue)} />;
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localize(i18n)}>
      <Controller
        as={renderPicker}
        {...commonInputProps}
        helperText={<>{commonInputProps.helperText}</>}
        defaultValue=""
      />
    </MuiPickersUtilsProvider>
  );
};

DateInput.defaultProps = {
  metaInputProps: {}
};

DateInput.displayName = "DateInput";

DateInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object
};

export default DateInput;
