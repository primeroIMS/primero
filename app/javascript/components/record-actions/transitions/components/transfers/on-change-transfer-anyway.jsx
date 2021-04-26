/* eslint-disable react/display-name, react/prop-types */

import { Checkbox } from "@material-ui/core";

import onChange from "./provided-form-on-change";

export default (props, dispatch, setDisabled, recordType) => {
  const { field, form } = props;
  const { value } = field;
  const handleOnChange = () => onChange(dispatch, field, form, setDisabled, recordType);

  return <Checkbox checked={value} onChange={handleOnChange} />;
};
