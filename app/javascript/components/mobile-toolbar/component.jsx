import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { AppBar, Toolbar, IconButton, makeStyles, Hidden } from "@material-ui/core";
import PropTypes from "prop-types";

import ModuleLogo from "../module-logo";

import styles from "./styles.css";

const MobileToolbar = ({ openDrawer }) => {
  const css = makeStyles(styles)();

  return (
    <Hidden mdUp implementation="css">
      <AppBar position="fixed">
        <Toolbar className={css.toolbar}>
          <IconButton edge="start" color="default" aria-label="Menu" onClick={openDrawer}>
            <MenuIcon />
          </IconButton>
          <ModuleLogo className={css.logo} />
        </Toolbar>
      </AppBar>
    </Hidden>
  );
};

MobileToolbar.displayName = "MobileToolbar";

MobileToolbar.propTypes = {
  openDrawer: PropTypes.func.isRequired
};

export default MobileToolbar;
