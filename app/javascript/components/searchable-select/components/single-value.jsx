import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { SINGLE_VALUE_NAME as NAME } from "./constants";
import styles from "./styles.css";

const SingleValue = props => {
  const css = makeStyles(styles)();
  const { innerProps, children, options, data } = props;

  const foundOption = options.find(op => op.value === data.value);
  const translatedLabel =
    foundOption && foundOption.label !== children
      ? foundOption.label
      : children;

  return (
    <Typography noWrap className={css.singleValue} {...innerProps}>
      {translatedLabel}
    </Typography>
  );
};

SingleValue.displayName = NAME;

SingleValue.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  innerProps: PropTypes.any,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectProps: PropTypes.object.isRequired
};

export default SingleValue;
