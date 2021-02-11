/* eslint-disable react/display-name, react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { Controller, useWatch } from "react-hook-form";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { parseISO } from "date-fns";
import isEmpty from "lodash/isEmpty";

import { toServerDateFormat } from "../../../libs";
import { useI18n } from "../../i18n";
import localize from "../../../libs/date-picker-localization";

const DateInput = ({ commonInputProps, metaInputProps, formMethods }) => {
  const i18n = useI18n();
  const { setValue, control } = formMethods;
  const { name } = commonInputProps;

  const fieldValue = useWatch({ name, control });

  const dialogLabels = {
    clearLabel: i18n.t("buttons.clear"),
    cancelLabel: i18n.t("buttons.cancel"),
    okLabel: i18n.t("buttons.ok")
  };

  const { dateIncludeTime } = metaInputProps;

  const getDateValue = value => {
    if (isEmpty(value)) {
      return value;
    }

    return dateIncludeTime ? parseISO(value) : parseISO(value.slice(0, 10));
  };

  const handleChange = date => {
    setValue(name, date ? toServerDateFormat(date, { includeTime: dateIncludeTime }) : "", { shouldDirty: true });

    return date;
  };

  const renderPicker = () => {
    if (dateIncludeTime) {
      return (
        <DateTimePicker
          {...dialogLabels}
          {...commonInputProps}
          onChange={handleChange}
          value={getDateValue(fieldValue)}
        />
      );
    }

    return (
      <DatePicker {...dialogLabels} {...commonInputProps} onChange={handleChange} value={getDateValue(fieldValue)} />
    );
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localize(i18n)}>
      <Controller
        control={control}
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
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object
};

export default DateInput;
