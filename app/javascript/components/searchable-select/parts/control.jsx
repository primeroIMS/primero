import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./styles.css";

const inputComponent = ({ inputRef, ...props }) => {
  return <div ref={inputRef} {...props} />;
};

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired
    })
  ])
};

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
        inputComponent,
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
