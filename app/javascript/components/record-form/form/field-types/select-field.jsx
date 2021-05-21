import PropTypes from "prop-types";
import { FastField, getIn } from "formik";

import { SELECT_FIELD_NAME } from "../constants";
import { shouldFieldUpdate } from "../utils";

import SelectFieldContainer from "./select-field-container";

const SelectField = ({
  name,
  field,
  label,
  helperText,
  InputLabelProps,
  InputProps,
  mode,
  disabled,
  formik,
  optionsSelector,
  ...other
}) => {
  return (
    <FastField name={name} shouldUpdate={shouldFieldUpdate}>
      {({ form }) => {
        return (
          <SelectFieldContainer
            field={field}
            value={getIn(form.values, name)}
            disabled={disabled}
            InputLabelProps={InputLabelProps}
            InputProps={InputProps}
            mode={mode}
            name={name}
            setFieldValue={form.setFieldValue}
            label={label}
            filters={other.filters}
            optionsSelector={optionsSelector}
            error={getIn(form.error, name)}
            touched={getIn(form.touched, name)}
            helperText={helperText}
          />
        );
      }}
    </FastField>
  );
};

SelectField.displayName = SELECT_FIELD_NAME;

SelectField.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  label: PropTypes.string.isRequired,
  mode: PropTypes.object,
  name: PropTypes.string.isRequired,
  optionsSelector: PropTypes.func.isRequired
};

export default SelectField;
