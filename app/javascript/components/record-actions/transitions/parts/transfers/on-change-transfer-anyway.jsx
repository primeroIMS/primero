/* eslint-disable react/display-name, react/prop-types */

import { Checkbox } from "@material-ui/core";
import React from "react";

import onChange from "./provided-form-on-change";

export default (props, dispatch, setDisabled, recordType) => {
  const { field, form } = props;
  const { value } = field;

  return (
    <Checkbox
      checked={value}
      onChange={() => onChange(dispatch, field, form, setDisabled, recordType)}
    />
  );
};
