import React from "react";
import PropTypes from "prop-types";
import { FastField } from "formik";
import { CheckboxWithLabel } from "formik-material-ui";
import pickBy from "lodash/pickBy";

const TickField = ({ name, label, ...rest }) => {
  const fieldProps = {
    component: CheckboxWithLabel,
    name,
    Label: { label },
    ...pickBy(rest, (v, k) => ["disabled"].includes(k))
  };

  return <FastField {...fieldProps} />;
};

TickField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string
};

export default TickField;
