// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { FastField, connect, getIn } from "formik";
import pickBy from "lodash/pickBy";
import { FormControlLabel, FormHelperText, InputLabel, FormControl, Checkbox } from "@mui/material";
import { cx } from "@emotion/css";

import { TICK_FIELD_NAME } from "../constants";
import { useI18n } from "../../../i18n";
import css from "../styles.css";

function TickField({ helperText, name, label, tickBoxlabel, formik, disabled = false, ...rest }) {
  const i18n = useI18n();
  const fieldProps = {
    name,
    inputProps: { required: true, name },
    disabled,
    ...pickBy(rest, (v, k) => ["disabled"].includes(k))
  };
  const { InputLabelProps: inputLabelProps } = rest;
  const value = getIn(formik.values, name);
  const fieldError = getIn(formik.errors, name);
  const displayHelperText = fieldError ? (
    <FormHelperText error>{fieldError}</FormHelperText>
  ) : (
    <FormHelperText>{helperText}</FormHelperText>
  );
  const classes = cx({
    [css.error]: Boolean(fieldError)
  });

  useEffect(() => {
    if (rest.checked && !getIn(formik.values, name) && rest.mode.isNew) {
      formik.setFieldValue(name, true, false);
    }
  }, []);

  const handleChange = event => {
    formik.setFieldValue(name, event.target.checked);
  };

  return (
    <FormControl fullWidth error={fieldError}>
      <InputLabel htmlFor={name} className={classes} {...inputLabelProps}>
        {label}
      </InputLabel>
      <FormControlLabel
        label={tickBoxlabel || i18n.t("yes_label")}
        disabled={disabled}
        onChange={handleChange}
        checked={value}
        control={<FastField type="checkbox" component={Checkbox} {...fieldProps} indeterminate={false} />}
      />
      {displayHelperText}
    </FormControl>
  );
}

TickField.displayName = TICK_FIELD_NAME;

TickField.propTypes = {
  disabled: PropTypes.bool,
  formik: PropTypes.object,
  helperText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  tickBoxlabel: PropTypes.string
};

export default connect(TickField);
