import PropTypes from "prop-types";
import { differenceInYears, parseISO } from "date-fns";
import { InputAdornment } from "@material-ui/core";
import { FastField, connect, getIn } from "formik";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef } from "react";

import { toServerDateFormat } from "../../../../libs";
import { DATE_FORMAT, DATE_TIME_FORMAT, DEFAULT_DATE_VALUES } from "../../../../config";
import { DATE_FIELD_NAME } from "../constants";
import { NOT_FUTURE_DATE } from "../../constants";

import DateFieldPicker from "./date-field-picker";

const DateField = ({ displayName, name, helperText, mode, formik, InputProps, formSection, ...rest }) => {
  const fieldValue = useRef(null);
  const formInstance = useRef();

  const allowedDefaultValues = Object.values(DEFAULT_DATE_VALUES);

  const { date_include_time: dateIncludeTime, selected_value: selectedValue } = rest.field;

  const dateOfBirthMatches = name.match(/(.*)date_of_birth$/);
  const ageFieldName = isEmpty(dateOfBirthMatches) ? null : `${dateOfBirthMatches[1]}age`;
  const isAgeVisible =
    ageFieldName && formSection?.fields?.some(formField => formField.name === ageFieldName && formField.visible);

  useEffect(() => {
    if (fieldValue.current && formInstance) {
      formInstance.current.setFieldValue(name, fieldValue.current, true);
    }
  }, [fieldValue.current, formInstance]);

  const fieldProps = {
    name
  };

  const updateAgeField = (form, date) => {
    if (dateOfBirthMatches && date && isAgeVisible) {
      const diff = differenceInYears(new Date(), date || new Date());

      form.setFieldValue(ageFieldName, diff, true);
    }
  };

  const getDateValue = (form, field) => {
    const { value } = field;
    let dateValue = null;

    if (value) {
      dateValue = value;
    } else if (
      !value &&
      allowedDefaultValues.includes(selectedValue?.toUpperCase()) &&
      mode?.isNew &&
      !form?.touched[name]
    ) {
      dateValue = new Date();
    }

    formInstance.current = form;
    fieldValue.current = dateValue;

    if (dateIncludeTime || isEmpty(value)) {
      return dateValue;
    }

    return parseISO(dateValue.slice(0, 10));
  };

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return (
    <FastField
      {...fieldProps}
      render={({ field, form }) => {
        const onChange = date => {
          updateAgeField(form, date);

          const formattedDate = date ? toServerDateFormat(date, { includeTime: dateIncludeTime }) : null;

          return form.setFieldValue(name, formattedDate, true);
        };

        const dateProps = {
          ...{ ...field, value: getDateValue(form, field) },
          ...omitBy(rest, (value, key) =>
            ["recordType", "recordID", "formSection", "field", "displayName", "linkToForm", "tickBoxlabel"].includes(
              key
            )
          ),
          format: dateIncludeTime ? DATE_TIME_FORMAT : DATE_FORMAT,
          clearable: true,
          InputProps: {
            ...InputProps,
            ...(mode.isShow || {
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon />
                </InputAdornment>
              )
            })
          },
          onChange,
          disableFuture: rest.field && rest.field.get("date_validation") === NOT_FUTURE_DATE,
          error: !!(fieldError && fieldTouched)
        };

        return (
          <DateFieldPicker
            dateIncludeTime={dateIncludeTime}
            dateProps={dateProps}
            helperText={helperText}
            fieldTouched={fieldTouched}
            fieldError={fieldError}
            displayName={displayName}
          />
        );
      }}
    />
  );
};

DateField.displayName = DATE_FIELD_NAME;

DateField.propTypes = {
  displayName: PropTypes.object,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object,
  helperText: PropTypes.string,
  InputProps: PropTypes.object,
  mode: PropTypes.object,
  name: PropTypes.string,
  value: PropTypes.string
};

export default connect(DateField);
