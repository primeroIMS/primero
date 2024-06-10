// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name, react/prop-types */

import { Checkbox } from "@mui/material";

export default (props, setDisabled) => {
  const { field, form } = props;
  const { value } = field;
  const onChange = (fieldCheckbox, formCheckbox) => {
    setDisabled(!fieldCheckbox.value);
    formCheckbox.setFieldValue(fieldCheckbox.name, !fieldCheckbox.value, false);
  };
  const handleOnChange = () => onChange(field, form);

  return <Checkbox checked={value} onChange={handleOnChange} />;
};
