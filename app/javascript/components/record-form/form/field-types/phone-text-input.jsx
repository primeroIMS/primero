import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { forwardRef } from "react";

import css from "./styles.css";

const PhoneTextInput = forwardRef(({ name, fieldError, ...rest }, ref) => {
  const slotProps = fieldError
    ? { input: { className: css.fieldInputWarning }, formHelperText: { className: css.fieldHelperTextWarning } }
    : {};

  return <TextField id={name} variant="outlined" inputRef={ref} slotProps={slotProps} sx={{ margin: "0" }} {...rest} />;
});

PhoneTextInput.propTypes = {
  fieldError: PropTypes.string,
  name: PropTypes.string,
  rest: PropTypes.object
};

PhoneTextInput.displayName = "PhoneTextInput";

export default PhoneTextInput;
