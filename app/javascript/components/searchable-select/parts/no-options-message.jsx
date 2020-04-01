import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./styles.css";

const NoOptionsMessage = props => {
  const css = makeStyles(styles)();
  const { innerProps, children } = props;

  return (
    <Typography
      color="textSecondary"
      className={css.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  );
};

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
};

export default NoOptionsMessage;
