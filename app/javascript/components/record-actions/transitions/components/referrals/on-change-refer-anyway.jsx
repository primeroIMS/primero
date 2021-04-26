/* eslint-disable react/display-name, react/prop-types */

import { Checkbox } from "@material-ui/core";

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
