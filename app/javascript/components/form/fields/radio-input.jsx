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
import { Controller } from "react-hook-form";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const RadioInput = ({ commonInputProps, options, formMethods }) => {
  const css = useStyles();
  const { helperText, error, name, label: radioGroupLabel, className, disabled } = commonInputProps;
  const { control } = formMethods;

  return (
    <FormControl error={error} className={className}>
      <FormLabel component="legend" className="MuiInputLabel-root">
        {radioGroupLabel}
      </FormLabel>
      <Controller
        control={control}
        as={
          <RadioGroup aria-label="format" name={name} className={css.rowDirection}>
            {options &&
              options.map(({ id, label }) => (
                <FormControlLabel
                  key={`form-control-label-${id}`}
                  value={id}
                  label={label}
                  disabled={disabled}
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
  formMethods: PropTypes.object.isRequired,
  options: PropTypes.array
};

export default RadioInput;
