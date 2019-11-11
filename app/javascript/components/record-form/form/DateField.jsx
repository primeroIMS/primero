import React from "react";
import PropTypes from "prop-types";
import { differenceInYears } from "date-fns";
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import { InputAdornment } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { FastField, connect, getIn } from "formik";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import omitBy from "lodash/omitBy";

const DateField = ({ name, helperText, mode, formik, ...rest }) => {
  const i18n = useI18n();
  const allowedDefaultValues = ["TODAY", "NOW"];

  const {
    visible,
    date_include_time: dateIncludeTime,
    hide_on_view_page: hideOnViewPage,
    selected_value: selectedValue
  } = rest.field;

  const fieldProps = {
    name
  };

  const updateAgeField = (form, date) => {
    const matches = name.match(/(.*)date_of_birth$/);
    if (matches && date) {
      const diff = differenceInYears(new Date(), date || new Date());
      form.setFieldValue(`${matches[1]}age`, diff, true);
    }
  };

  const getDateValue = (form, field) => {
    const { value } = field;
    let dateValue = null;
    if (value) {
      dateValue = value;
    } else if (
      !value &&
      allowedDefaultValues.includes(selectedValue.toUpperCase()) &&
      !mode.isShow
    ) {
      dateValue = new Date();
    }
    form.setFieldValue(name, dateValue, true);
    return dateValue;
  };

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return !(mode.isShow && hideOnViewPage) && visible ? (
    <FastField
      {...fieldProps}
      render={({ field, form }) => {
        const dateProps = {
          ...field,
          ...omitBy(rest, (v, k) => ["recordType", "recordID"].includes(k)),
          value: getDateValue(form, field),
          format: dateIncludeTime ? "dd-MMM-yyyy HH:mm" : "dd-MMM-yyyy",
          helperText:
            (fieldTouched && fieldError) ||
            helperText ||
            i18n.t("fields.date_help"),
          clearable: true,
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <CalendarTodayIcon />
              </InputAdornment>
            )
          },
          onChange: date => {
            updateAgeField(form, date);
            return form.setFieldValue(name, date, true);
          },
          disableFuture:
            rest.field &&
            rest.field.get("date_validation") === "not_future_date",
          error: !!(fieldError && fieldTouched)
        };

        return dateIncludeTime ? (
          <DateTimePicker {...dateProps} />
        ) : (
          <DatePicker {...dateProps} />
        );
      }}
    />
  ) : null;
};

DateField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  helperText: PropTypes.string,
  formik: PropTypes.object.isRequired,
  mode: PropTypes.object
};

export default connect(DateField);
