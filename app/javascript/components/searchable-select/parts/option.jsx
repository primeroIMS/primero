import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { OPTION_NAME as NAME } from "./constants";
import styles from "./styles.css";

const Option = props => {
  const css = makeStyles(styles)();
  const { innerRef, isFocused, isSelected, innerProps, children } = props;

  return (
    <MenuItem
      ref={innerRef}
      selected={isFocused}
      component="div"
      className={clsx(css.option, {
        [css.optionSelected]: isSelected
      })}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
};

Option.displayName = NAME;

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
