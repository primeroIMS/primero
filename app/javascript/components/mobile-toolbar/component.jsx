import React, { useEffect } from "react";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import { ModuleLogo } from "components/module-logo";
import { AppBar, Toolbar, IconButton, makeStyles } from "@material-ui/core";
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
  }, [mobileDisplay]);

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

MobileToolbar.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};

export default MobileToolbar;
