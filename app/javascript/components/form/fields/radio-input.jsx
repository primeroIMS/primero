import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  makeStyles
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";

import styles from "./styles.css";

const RadioInput = ({ commonInputProps, options }) => {
  const css = makeStyles(styles)();
  const {
    helperText,
    error,
    name,
    label: radioGroupLabel,
    className
  } = commonInputProps;

  const { control } = useForm();

  return (
    <FormControl error={error} className={className}>
      <FormLabel component="legend" className="MuiInputLabel-root">
        {radioGroupLabel}
      </FormLabel>
      <Controller
        as={
          <RadioGroup
            aria-label="format"
            name={name}
            className={css.rowDirection}
            control={control}
          >
            {options &&
              options.map(({ id, label }) => (
                <FormControlLabel
                  key={`form-control-label-${id}`}
                  value={id}
                  label={label}
                  control={<Radio />}
                />
              ))}
          </RadioGroup>
        }
        name={name}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

RadioInput.displayName = "RadioInput";

RadioInput.propTypes = {
  commonInputProps: PropTypes.shape({
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string
  }),
  options: PropTypes.array
};

export default RadioInput;
