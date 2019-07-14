import React from "react";
import { TextField as MuiTextField } from "formik-material-ui";
import { FastField } from "formik";

const TextField = props => {
  const fieldProps = {
    component: MuiTextField,
    ...props
  };

  return <FastField {...fieldProps} />;
};

export default TextField;
