import React from "react";
import PropTypes from "prop-types";
import {
  FormGroup,
  FormControl,
  FormLabel,
  FormHelperText
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Controller } from "react-hook-form";

import CheckboxGroup from "./checkbox-group";
import styles from "./styles.css";

const CheckboxInput = ({ commonInputProps, options }) => {
  const css = makeStyles(styles)();

  const { name, error, required, label, helperText } = commonInputProps;

  return (
    <FormControl
      component="fieldset"
      error={error}
      className={css.checkboxContainer}
    >
      <FormLabel required={required}>{label}</FormLabel>
      <FormGroup>
        <Controller
          name={name}
          as={CheckboxGroup}
          options={options}
          commonInputProps={commonInputProps}
          defaultValue={[]}
        />
      </FormGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

CheckboxInput.displayName = "CheckboxInput";

CheckboxInput.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool
  }),
  options: PropTypes.array
};

export default CheckboxInput;
