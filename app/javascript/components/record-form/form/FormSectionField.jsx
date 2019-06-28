/* eslint-disable import/no-cycle */

import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import SubformField from "./SubformField";
import DateField from "./DateField";
import * as C from "../constants";

const FormSectionField = ({ field, values, index, form, mode }) => {
  const {
    display_name: displayName,
    help_text: helpText,
    name,
    type,
    disabled,
    editable,
    visible
  } = field;

  const fieldName = index >= 0 ? `${form.id}[${index}][${name}]` : name;

  const fieldProps = {
    name: fieldName,
    multiline: type === "textarea",
    fullWidth: true,
    InputProps: {
      readOnly: mode.isShow
    },
    InputLabelProps: {
      shrink: true
    },
    helperText: helpText ? helpText.en : "",
    autoComplete: "off",
    label: displayName.en,
    value: values[fieldName],
    disabled: mode.isShow || disabled || !editable
  };

  const fieldComponent = () => {
    switch (type) {
      case C.DATE_FIELD:
        return DateField;
      default:
        return TextField;
    }
  };

  return (
    <>
      {type === C.SUBFORM_SECTION ? (
        <SubformField {...{ field, values, mode }} />
      ) : (
        visible && <Field {...fieldProps} component={fieldComponent()} />
      )}
    </>
  );
};

FormSectionField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object,
  values: PropTypes.object,
  index: PropTypes.number,
  mode: PropTypes.object
};

export default FormSectionField;
