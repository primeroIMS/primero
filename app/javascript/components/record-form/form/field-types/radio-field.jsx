// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name,  react/no-multi-comp */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { FormControlLabel, FormHelperText, Radio, FormControl, InputLabel } from "@mui/material";
import { Field, connect, getIn } from "formik";
import omitBy from "lodash/omitBy";
import { RadioGroup } from "formik-mui";

import { useI18n } from "../../../i18n";
import { getOption } from "../../selectors";
import { RADIO_FIELD_NAME } from "../constants";
import css from "../styles.css";
import { useMemoizedSelector } from "../../../../libs";

function RadioField({ name, helperText, label, disabled, field, formik, mode, ...rest }) {
  const i18n = useI18n();

  const selectedValue = field.selected_value;
  const option = field.option_strings_source || field.option_strings_text;

  const value = getIn(formik.values, name);
  const [stickyOption, setStickyOption] = useState(value);

  const radioProps = {
    control: <Radio disabled={disabled} />,
    classes: {
      label: css.radioLabels
    }
  };

  const options = useMemoizedSelector(state => getOption(state, option, i18n.locale, stickyOption));

  const fieldProps = {
    name,
    value: value === undefined ? null : value,
    onChange: (e, val) => formik.setFieldValue(name, val, false),
    ...omitBy(rest, (val, key) =>
      [
        "InputProps",
        "helperText",
        "InputLabelProps",
        "fullWidth",
        "recordType",
        "recordID",
        "formSection",
        "field",
        "displayName",
        "linkToForm",
        "tickBoxlabel"
      ].includes(key)
    )
  };

  const fieldError = getIn(formik.errors, name);

  useEffect(() => {
    if (mode.isNew && selectedValue && value === "") {
      formik.setFieldValue(name, selectedValue, false);
    }
  }, []);

  useEffect(() => {
    if (value && (!stickyOption || isEmpty(stickyOption))) {
      setStickyOption(String(value));
    }
  }, [value]);

  const renderFormControl = opt => {
    const optLabel = typeof opt.display_text === "object" ? opt.display_text[i18n.locale] : opt.display_text;

    return (
      <FormControlLabel
        disabled={opt.disabled || mode.isShow || disabled}
        key={`${name}-${opt.id}`}
        value={opt.id.toString()}
        label={optLabel}
        {...radioProps}
      />
    );
  };

  const renderOption = options.length > 0 && options.map(opt => renderFormControl(opt));

  return (
    <FormControl id={name} fullWidth error={!!fieldError}>
      <InputLabel shrink htmlFor={fieldProps.name} required={field.required}>
        {label}
      </InputLabel>
      <Field component={RadioGroup} {...fieldProps}>
        <div className={css.radioOption}>{renderOption}</div>
      </Field>
      <FormHelperText>{fieldError || helperText}</FormHelperText>
    </FormControl>
  );
}

RadioField.displayName = RADIO_FIELD_NAME;

RadioField.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  mode: PropTypes.object,
  name: PropTypes.string.isRequired
};

export default connect(RadioField);
