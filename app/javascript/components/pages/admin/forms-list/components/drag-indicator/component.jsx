// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Icon } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import css from "../../styles.css";

const Component = ({ isDragDisabled, ...props }) => {
  const classes = isDragDisabled ? { classes: { root: css.dragIndicator } } : {};

  return (
    <Icon {...props} {...classes} data-testid="drag-indicator">
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
