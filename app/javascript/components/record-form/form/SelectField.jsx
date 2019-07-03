import React from "react";
import PropTypes from "prop-types";
import { InputLabel, FormControl, MenuItem } from "@material-ui/core";
import { Select } from "formik-material-ui";
import { Field } from "formik";
import omitBy from "lodash/omitBy";
import { useSelector } from "react-redux";
import { getOption } from "../selectors";

const SelectField = ({ label, option, ...other }) => {
  const fieldProps = {
    component: Select,
    ...omitBy(other, (v, k) =>
      ["InputProps", "helperText", "InputLabelProps"].includes(k)
    )
  };

  const options = useSelector(state =>
    getOption(state, option ? option.replace(/lookup /, "") : "")
  );

  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={other.name}>
        {label}
      </InputLabel>
      <Field {...fieldProps}>
        {options.size > 0 &&
          options
            .first()
            .options.map(o => (
              <MenuItem value={o.id}>{o.display_text}</MenuItem>
            ))}
      </Field>
    </FormControl>
  );
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  option: PropTypes.string
};

export default SelectField;
