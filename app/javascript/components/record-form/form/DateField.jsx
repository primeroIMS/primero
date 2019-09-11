import React from "react";
import PropTypes from "prop-types";
import { differenceInYears } from "date-fns";
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import { InputAdornment } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { FastField, connect, getIn } from "formik";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

const DateField = ({ name, helperText, formik, ...rest }) => {
  const i18n = useI18n();
  const {
    visible,
    date_include_time: dateIncludeTime,
    hide_on_view_page: hideOnViewPage,
    selected_value: selectedValue
  } = rest.field.toJS();

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

  const getDateValue = value => {
    let dateValue = null;
    if (value) {
      dateValue = value;
    } else if (
      ["TODAY", "NOW"].includes(selectedValue.toUpperCase()) &&
      rest.mode.isNew
    ) {
      dateValue = new Date();
    } else {
      dateValue = "";
    }
    return dateValue;
  };

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return !(rest.mode.isShow && hideOnViewPage) && visible ? (
    <FastField
      {...fieldProps}
      render={({ field, form }) => {
        const dateProps = {
          ...field,
          ...rest,
          value: getDateValue(field.value),
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
            rest.field.get("date_validation") === "default_date_validation",
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
  formik: PropTypes.object.isRequired
};

export default connect(DateField);
