import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  FormControlLabel,
  FormHelperText,
  Radio,
  FormControl,
  InputLabel,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { RadioGroup } from "formik-material-ui";
import { Field, connect, getIn } from "formik";
import omitBy from "lodash/omitBy";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import { getOption } from "../../selectors";
import { RADIO_FIELD_NAME } from "../constants";
import styles from "../styles.css";

const RadioField = ({
  name,
  helperText,
  label,
  disabled,
  field,
  formik,
  mode,
  ...rest
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const selectedValue = field.selected_value;
  const option = field.option_strings_source || field.option_strings_text;

  const value = getIn(formik.values, name);

  const radioProps = {
    control: <Radio disabled={disabled} />,
    classes: {
      label: css.radioLabels
    }
  };

  const options = useSelector(state => getOption(state, option, i18n));

  const fieldProps = {
    name,
    ...omitBy(rest, (v, k) =>
      [
        "InputProps",
        "helperText",
        "InputLabelProps",
        "fullWidth",
        "recordType",
        "recordID"
      ].includes(k)
    )
  };

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  useEffect(() => {
    if (mode.isNew && selectedValue && value === "") {
      formik.setFieldValue(name, selectedValue, false);
    }
  }, []);

  return (
    <FormControl fullWidth error={!!(fieldError && fieldTouched)}>
      <InputLabel shrink htmlFor={fieldProps.name} className={css.inputLabel}>
        {label}
      </InputLabel>
      <Field
        {...fieldProps}
        render={({ form }) => {
          return (
            <RadioGroup
              {...fieldProps}
              value={String(value)}
              onChange={(e, val) =>
                form.setFieldValue(fieldProps.name, val, true)
              }
            >
              <Box display="flex">
                {options.length > 0 &&
                  options.map(o => (
                    <FormControlLabel
                      key={o.id}
                      value={o.id.toString()}
                      label={o.display_text[i18n.locale]}
                      {...radioProps}
                    />
                  ))}
              </Box>
            </RadioGroup>
          );
        }}
      />
      <FormHelperText>
        {fieldError && fieldTouched ? fieldError : helperText}
      </FormHelperText>
    </FormControl>
  );
};

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
