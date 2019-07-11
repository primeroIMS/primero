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
import { Field } from "formik";
import omitBy from "lodash/omitBy";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import { getOption } from "../selectors";
import styles from "./styles.css";

const RadioField = ({ label, disabled, value, option, ...other }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

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
    ...omitBy(other, (v, k) =>
      ["InputProps", "helperText", "InputLabelProps", "fullWidth"].includes(k)
    )
  };

  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={other.name}>
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
              <Box display="flex" mt={3}>
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
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  option: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default RadioField;
