import React from "react";
import PropTypes from "prop-types";
import { FastField } from "formik";
import { CheckboxWithLabel } from "formik-material-ui";

const TickField = ({ label, ...rest }) => {
  const fieldProps = {
    component: CheckboxWithLabel,
    Label: { label },
    ...rest
  };

  return <FastField {...fieldProps} />;
};

TickField.propTypes = {
  label: PropTypes.string
};

export default TickField;
