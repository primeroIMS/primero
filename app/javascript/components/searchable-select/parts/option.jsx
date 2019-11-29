import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";

const Option = props => {
  const { innerRef, isFocused, isSelected, innerProps, children } = props;

  return (
    <MenuItem
      ref={innerRef}
      selected={isFocused}
      component="div"
      style={{
        backgroundColor: isSelected ? "#0093ba" : "",
        color: isSelected ? "#FFF" : "",
        whiteSpace: "normal",
        fontSize: 12
      }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
};

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired
  }).isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired
    })
  ]),
  isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired
};

export default Option;
