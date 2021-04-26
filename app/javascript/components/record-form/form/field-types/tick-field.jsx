import { useEffect } from "react";
import PropTypes from "prop-types";
import { FastField, connect, getIn } from "formik";
import { Checkbox } from "formik-material-ui";
import pickBy from "lodash/pickBy";
import { FormControlLabel, FormHelperText, InputLabel, FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { TICK_FIELD_NAME } from "../constants";
import { useI18n } from "../../../i18n";
import styles from "../styles.css";

const useStyles = makeStyles(styles);

const TickField = ({ helperText, name, label, tickBoxlabel, formik, ...rest }) => {
  const i18n = useI18n();
  const css = useStyles();
  const fieldProps = {
    name,
    inputProps: { required: true },
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
        control={
          <FastField
            name={name}
            render={renderProps => {
              return (
                <Checkbox
                  {...fieldProps}
                  form={renderProps.form}
                  field={{
                    ...renderProps.field
                  }}
                />
              );
            }}
          />
        }
      />
      {displayHelperText}
    </FormControl>
  );
};

TickField.displayName = TICK_FIELD_NAME;

TickField.propTypes = {
  formik: PropTypes.object,
  helperText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  tickBoxlabel: PropTypes.string
};

export default connect(TickField);
