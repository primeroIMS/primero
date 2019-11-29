import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Chip from "@material-ui/core/Chip";
import Cancel from "@material-ui/icons/Cancel";

const MultiValue = props => {
  const {
    children,
    selectProps,
    isFocused,
    removeProps,
    options,
    data
  } = props;

  const foundOption = options.find(op => op.value === data.value);
  const translatedLabel =
    foundOption.label !== children ? foundOption.label : children;

  return (
    <Chip
      tabIndex={-1}
      label={translatedLabel}
      className={clsx(selectProps.classes.chip, {
        [selectProps.classes.chipFocused]: isFocused
      })}
      classes={{ label: selectProps.classes.chipLabel }}
      onDelete={removeProps.onClick}
      deleteIcon={<Cancel {...removeProps} />}
    />
  );
};

MultiValue.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  isFocused: PropTypes.bool.isRequired,
  options: PropTypes.array,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onTouchEnd: PropTypes.func.isRequired
  }).isRequired,
  selectProps: PropTypes.object.isRequired
};

export default MultiValue;
