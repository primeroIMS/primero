import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";

const Menu = props => {
  const { selectProps, innerProps, children } = props;

  return (
    <Paper square className={selectProps.classes.paper} {...innerProps}>
      {children}
    </Paper>
  );
};

Menu.propTypes = {
  children: PropTypes.element.isRequired,
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired
};

export default Menu;
