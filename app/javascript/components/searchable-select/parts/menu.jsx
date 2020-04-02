import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import { MENU_NAME as NAME } from "./constants";
import styles from "./styles.css";

const Menu = props => {
  const css = makeStyles(styles)();
  const { innerProps, children } = props;

  return (
    <Paper square className={css.paper} {...innerProps}>
      {children}
    </Paper>
  );
};

Menu.displayName = NAME;

Menu.propTypes = {
  children: PropTypes.element.isRequired,
  innerProps: PropTypes.object.isRequired
};

export default Menu;
