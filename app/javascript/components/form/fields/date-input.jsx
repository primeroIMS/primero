/* eslint-disable react/display-name, react/no-multi-comp */
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { Controller, useWatch } from "react-hook-form";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import isEmpty from "lodash/isEmpty";
import { parseISO } from "date-fns";

import { toServerDateFormat } from "../../../libs";
import { useI18n } from "../../i18n";
import localize from "../../../libs/date-picker-localization";

const DateInput = ({ commonInputProps, metaInputProps, formMethods }) => {
  const i18n = useI18n();
  const { setValue, control } = formMethods;
  const { name, helperText } = commonInputProps;

  const currentValue = useWatch({ name, control });

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

  // const handleClearable = () => {
  //   setValue(name, null);
  // };

  // const neDateProps = {
  //   name,
  //   onChange: handleChange,
  //   error,
  //   disabled,
  //   placeholder,
  //   dateIncludeTime,
  //   value: currentValue
  // };

  const fieldValue = isEmpty(currentValue) ? null : parseISO(currentValue);

  const renderPicker = () => {
    if (dateIncludeTime) {
      return <DateTimePicker {...dialogLabels} {...commonInputProps} onChange={handleChange} value={fieldValue} />;
    }

    return <DatePicker {...dialogLabels} {...commonInputProps} onChange={handleChange} value={fieldValue} />;
  };

  // if (i18n.locale === LOCALE_KEYS.ne) {
  //   return (
  //     <NepaliCalendar helpText={helperText} label={label}
  // dateProps={neDateProps} handleClearable={handleClearable} />
  //   );
  // }

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
