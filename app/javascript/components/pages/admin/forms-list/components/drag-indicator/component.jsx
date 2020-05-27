import React from "react";
import PropTypes from "prop-types";
import { Icon, makeStyles } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import styles from "../../styles.css";

const Component = ({ isDragDisabled, ...props }) => {
  const css = makeStyles(styles)();
  const classes = isDragDisabled
    ? { classes: { root: css.dragIndicator } }
    : {};

  return (
    <Icon {...props} {...classes}>
      <DragIndicatorIcon />
    </Icon>
  );
};

Component.displayName = "DragIndicator";

Component.defaultProps = {
  isDragDisabled: false
};

Component.propTypes = {
  isDragDisabled: PropTypes.bool,
  props: PropTypes.object
};

export default Component;
