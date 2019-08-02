import React from "react";
import PropTypes from "prop-types";
import { differenceInYears } from "date-fns";
import { DatePicker } from "@material-ui/pickers";
import { InputAdornment } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { FastField, connect, getIn } from "formik";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

const DateField = ({ name, helperText, formik, ...rest }) => {
  const i18n = useI18n();

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

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return (
    <FastField
      {...fieldProps}
      render={({ field, form }) => {
        return (
          <DatePicker
            {...field}
            {...{
              format: "dd-MMM-yyyy",
              helperText:
                (fieldTouched && fieldError) ||
                helperText ||
                i18n.t("fields.date_help"),
              clearable: true,
              ...rest
            }}
            disableFuture={
              rest.field.get("date_validation") === "default_date_validation"
            }
            error={!!(fieldError && fieldTouched)}
            onChange={date => {
              updateAgeField(form, date);
              return form.setFieldValue(name, date, true);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon />
                </InputAdornment>
              )
            }}
          />
        );
      }}
    />
  );
};

DateField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  helperText: PropTypes.string,
  formik: PropTypes.object.isRequired
};

export default connect(DateField);
