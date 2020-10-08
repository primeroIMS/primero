import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FastField, connect, getIn } from "formik";
import { Checkbox } from "formik-material-ui";
import pickBy from "lodash/pickBy";
import { FormControlLabel, FormHelperText, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TICK_FIELD_NAME } from "../constants";
import { useI18n } from "../../../i18n";
import styles from "../styles.css";

const TickField = ({ helperText, name, label, tickBoxlabel, formik, ...rest }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const fieldProps = {
    name,
    ...pickBy(rest, (v, k) => ["disabled"].includes(k))
  };

  useEffect(() => {
    if (rest.checked && !getIn(formik.values, name) && rest.mode.isNew) {
      formik.setFieldValue(name, true, false);
    }
  }, []);

  return (
    <>
      <InputLabel shrink htmlFor={name} className={css.inputLabel}>
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
      <FormHelperText>{helperText}</FormHelperText>
    </>
  );
};

TickField.displayName = TICK_FIELD_NAME;

TickField.propTypes = {
  formik: PropTypes.object,
  helperText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  tickBoxlabel: PropTypes.object
};

export default connect(TickField);
