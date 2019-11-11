import React, { useEffect } from "react";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import { AppBar, Toolbar, IconButton, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";

import { ModuleLogo } from "../module-logo";

import styles from "./styles.css";

const MobileToolbar = ({ drawerOpen, openDrawer, mobileDisplay }) => {
  const css = makeStyles(styles)();

  const handleToggleDrawer = () => {
    openDrawer(!drawerOpen);
  };

  useEffect(() => {
    if (mobileDisplay) {
      openDrawer(false);
    }
  }, [mobileDisplay, openDrawer]);

  if (mobileDisplay) {
    return (
      <AppBar
        position="fixed"
        className={clsx(css.appBar, {
          [css.appBarShift]: drawerOpen
        })}
      >
        <Toolbar className={css.toolbar}>
          <IconButton
            edge="start"
            color="default"
            aria-label="Menu"
            onClick={handleToggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <ModuleLogo className={css.logo} />
        </Toolbar>
      </AppBar>
    );
  }

  return null;
};

MobileToolbar.displayName = "MobileToolbar";

MobileToolbar.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired
};

export default MobileToolbar;
