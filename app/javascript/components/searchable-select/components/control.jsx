import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import { CONTROL_NAME as NAME } from "./constants";
import Input from "./input";
import styles from "./styles.css";

const Control = props => {
  const css = makeStyles(styles)();
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { TextFieldProps }
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent: Input,
        inputProps: {
          className: css.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...TextFieldProps}
    />
  );
};

Control.displayName = NAME;

Control.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.shape({
    onMouseDown: PropTypes.func.isRequired
  }).isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired
    })
  ]).isRequired,
  selectProps: PropTypes.object.isRequired
};

export default Control;
