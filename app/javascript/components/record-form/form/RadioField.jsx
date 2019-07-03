import React from "react";
import PropTypes from "prop-types";
import {
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Box
} from "@material-ui/core";
import { RadioGroup } from "formik-material-ui";
import { Field } from "formik";
import omitBy from "lodash/omitBy";

const RadioField = ({ label, disabled, ...other }) => {
  const fieldProps = {
    component: RadioGroup,
    ...omitBy(other, (v, k) =>
      ["InputProps", "helperText", "InputLabelProps"].includes(k)
    ),
    inputRef: ""
  };

  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={other.name}>
        {label}
      </InputLabel>
      <Field {...fieldProps}>
        <Box display="flex" mt={3}>
          <FormControlLabel
            value="yes"
            label="Yes"
            control={<Radio disabled={disabled} />}
          />
          <FormControlLabel
            value="no"
            label="No"
            control={<Radio disabled={disabled} />}
          />
        </Box>
      </Field>
    </FormControl>
  );
};

RadioField.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default RadioField;
