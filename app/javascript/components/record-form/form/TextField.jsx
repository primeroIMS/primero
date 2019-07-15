import React from "react";
import PropTypes from "prop-types";
import { TextField as MuiTextField } from "formik-material-ui";
import { FastField } from "formik";

const TextField = ({ name, field, ...rest }) => {
  const { type, visible } = field;

  const fieldProps = {
    type: type === "numeric_field" ? "number" : "text",
    component: MuiTextField,
    multiline: type === "textarea",
    name,
    ...rest
  };

  return visible ? <FastField {...fieldProps} /> : null;
};

TextField.propTypes = {
  name: PropTypes.string,
  field: PropTypes.object
};

export default TextField;
