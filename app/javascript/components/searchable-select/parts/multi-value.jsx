import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Chip from "@material-ui/core/Chip";
import Cancel from "@material-ui/icons/Cancel";

const MultiValue = props => {
  const { children, selectProps, isFocused, removeProps } = props;
  return (
    <Chip
      tabIndex={-1}
      label={children}
      className={clsx(selectProps.classes.chip, {
        [selectProps.classes.chipFocused]: isFocused
      })}
      onDelete={removeProps.onClick}
      deleteIcon={<Cancel {...removeProps} />}
    />
  );
};

MultiValue.propTypes = {
  children: PropTypes.node,
  isFocused: PropTypes.bool.isRequired,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onTouchEnd: PropTypes.func.isRequired
  }).isRequired,
  selectProps: PropTypes.object.isRequired
};

export default MultiValue;
