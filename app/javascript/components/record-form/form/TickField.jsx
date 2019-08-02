import React from "react";
import PropTypes from "prop-types";
import { FastField } from "formik";
import { Switch } from "formik-material-ui";
import pickBy from "lodash/pickBy";
import { FormControlLabel } from "@material-ui/core";

const TickField = ({ name, label, ...rest }) => {
  const fieldProps = {
    component: Switch,
    name,
    ...pickBy(rest, (v, k) => ["disabled"].includes(k))
  };

  return (
    <FormControlLabel label={label} control={<FastField {...fieldProps} />} />
  );
};

TickField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string
};

export default TickField;
