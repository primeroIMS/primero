import React from "react";
import PropTypes from "prop-types";
import {
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { RadioGroup } from "formik-material-ui";
import { FastField, connect, getIn } from "formik";
import omitBy from "lodash/omitBy";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import { getOption } from "../selectors";
import styles from "./styles.css";

const RadioField = ({ name, label, disabled, field, formik, ...rest }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const option = field.option_strings_source || field.option_strings_text;

  const value = getIn(formik.values, name);

  const radioProps = {
    control: <Radio disabled={disabled} />,
    classes: {
      label: css.radioLabels
    }
  };

  const options = (() => {
    if (typeof option === "string") {
      return useSelector(state =>
        getOption(state, option.replace(/lookup /, ""))
      );
    }

    return option[i18n.locale];
  })();

  const fieldProps = {
    name,
    ...omitBy(rest, (v, k) =>
      ["InputProps", "helperText", "InputLabelProps", "fullWidth"].includes(k)
    )
  };

  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={fieldProps.name} className={css.inputLabel}>
        {label}
      </InputLabel>
      <FastField
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
                      label={o.display_text}
                      {...radioProps}
                    />
                  ))}
              </Box>
            </RadioGroup>
          );
        }}
      />
    </FormControl>
  );
};

RadioField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired
};

export default connect(RadioField);
