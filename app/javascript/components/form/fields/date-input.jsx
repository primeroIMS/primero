/* eslint-disable react/display-name, react/no-multi-comp */
import PropTypes from "prop-types";
import { Controller, useWatch } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import { parseISO } from "date-fns";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";

import { toServerDateFormat } from "../../../libs";
import { useI18n } from "../../i18n";
import { LOCALE_KEYS } from "../../../config";
import NepaliCalendar from "../../nepali-calendar-input";
import DateProvider from "../../../date-provider";
import { dayOfWeekFormatter } from "../../../libs/date-picker-localization";

function DateInput({ commonInputProps, metaInputProps = {}, formMethods }) {
  const i18n = useI18n();
  const { setValue, control } = formMethods;
  const { name, label, helperText, error, disabled, placeholder, fullWidth, required } = commonInputProps;

  const currentValue = useWatch({ name, control, disabled: i18n.locale !== LOCALE_KEYS.ne });

  const dialogLabels = {
    clearLabel: i18n.t("buttons.clear"),
    cancelLabel: i18n.t("buttons.cancel"),
    okLabel: i18n.t("buttons.ok")
  };

  const { dateIncludeTime } = metaInputProps;

  const handleChange = date => {
    setValue(name, date ? toServerDateFormat(date, { includeTime: dateIncludeTime }) : "", { shouldDirty: true });

    return date;
  };

  const neDateProps = {
    name,
    onChange: handleChange,
    error,
    disabled,
    placeholder,
    dateIncludeTime,
    value: currentValue
  };

  const inputProps = {
    views: ["year", "month", "day"],
    slotProps: {
      actionBar: {
        actions: ["clear", "accept"]
      },
      textField: {
        fullWidth,
        required,
        helperText,
        clearable: true,
        slotProps: { inputLabel: { shrink: true } }
      }
    }
  };

  if (i18n.locale === LOCALE_KEYS.ne) {
    return <NepaliCalendar helpText={helperText} label={label} dateProps={neDateProps} />;
  }

  return (
    <DateProvider>
      <Controller
        control={control}
        render={({ value: dateFieldValue, onChange: fieldOnChange }) => {
          const _fieldValue = isEmpty(dateFieldValue) ? null : parseISO(dateFieldValue);

          const onFieldChange = date => {
            fieldOnChange(date ? toServerDateFormat(date, { includeTime: dateIncludeTime }) : "");
          };

          if (dateIncludeTime) {
            return (
              <DateTimePicker
                {...dialogLabels}
                {...commonInputProps}
                {...inputProps}
                onChange={onFieldChange}
                value={_fieldValue}
              />
            );
          }

          return (
            <DatePicker
              {...dialogLabels}
              {...commonInputProps}
              {...inputProps}
              onChange={onFieldChange}
              value={_fieldValue}
              dayOfWeekFormatter={dayOfWeekFormatter(i18n)}
            />
          );
        }}
        {...commonInputProps}
        defaultValue=""
        slotProps={{
          textField: {
            error,
            helperText: error || helperText
          }
        }}
      />
    </DateProvider>
  );
}

DateInput.displayName = "DateInput";

DateInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object
};

export default DateInput;
