import { useEffect } from "react";
import PropTypes from "prop-types";
import { FastField, connect, getIn } from "formik";
import { Checkbox } from "formik-material-ui";
import pickBy from "lodash/pickBy";
import { FormControlLabel, FormHelperText, InputLabel, FormControl } from "@material-ui/core";
import clsx from "clsx";

import { TICK_FIELD_NAME } from "../constants";
import { useI18n } from "../../../i18n";
import css from "../styles.css";

const TickField = ({ helperText, name, label, tickBoxlabel, formik, disabled = false, ...rest }) => {
  const i18n = useI18n();

  const fieldProps = {
    name,
    inputProps: { required: true },
    disabled,
    ...pickBy(rest, (v, k) => ["disabled"].includes(k))
  };
  const { InputLabelProps: inputLabelProps } = rest;
  const fieldError = getIn(formik.errors, name);
  const displayHelperText = fieldError ? (
    <FormHelperText error>{fieldError}</FormHelperText>
  ) : (
    <FormHelperText>{helperText}</FormHelperText>
  );
  const classes = clsx({
    [css.error]: Boolean(fieldError)
  });

  useEffect(() => {
    if (rest.checked && !getIn(formik.values, name) && rest.mode.isNew) {
      formik.setFieldValue(name, true, false);
    }
  }, []);

  return (
    <FormControl fullWidth error={fieldError}>
      <InputLabel htmlFor={name} className={classes} {...inputLabelProps}>
        {label}
      </InputLabel>
      <FormControlLabel
        label={tickBoxlabel || i18n.t("yes_label")}
        disabled={disabled}
        control={<FastField name={name} type="checkbox" component={Checkbox} {...fieldProps} indeterminate={false} />}
      />
      {displayHelperText}
    </FormControl>
  );
};

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
