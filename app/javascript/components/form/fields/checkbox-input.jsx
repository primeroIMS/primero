import PropTypes from "prop-types";
import { FormGroup, FormControl, FormLabel, FormHelperText } from "@material-ui/core";
import { Controller } from "react-hook-form";

import CheckboxGroup from "./checkbox-group";
import css from "./styles.css";

const CheckboxInput = ({ commonInputProps, options, metaInputProps, formMethods }) => {
  const { control } = formMethods;
  const { name, error, required, label, helperText, disabled } = commonInputProps;
  const { inlineCheckboxes } = metaInputProps;

  return (
    <FormControl component="fieldset" error={error} className={css.checkboxContainer}>
      <FormLabel component="legend" required={required} disabled={disabled}>
        {label}
      </FormLabel>
      <FormGroup row={inlineCheckboxes}>
        <Controller
          control={control}
          name={name}
          as={CheckboxGroup}
          options={options}
          commonInputProps={commonInputProps}
          metaInputProps={metaInputProps}
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
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.shape({
    inlineCheckboxes: PropTypes.bool
  }),
  options: PropTypes.array
};

export default CheckboxInput;
