import React from "react";
import { TextField as MuiTextField } from "formik-material-ui";
import { Field } from "formik";

const TextField = props => {
  const fieldProps = {
    component: MuiTextField,
    ...props
  };

  return <Field {...fieldProps} />;
};

export default TextField;
