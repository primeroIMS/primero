import React, { useEffect } from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import { ModuleLogo } from "components/module-logo";
import { AccountMenu } from "components/account-menu";
import styles from "./styles.jss";

const MobileToolbar = ({ drawerOpen, openDrawer, username, mobileDisplay }) => {
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
            color="black"
            aria-label="Menu"
            onClick={handleToggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <ModuleLogo className={css.logo} />
          <AccountMenu username={username} mobile />
        </Toolbar>
      </AppBar>
    );
  }

  return null;
};

MobileToolbar.propTypes = {
  drawerOpen: PropTypes.bool.required,
  openDrawer: PropTypes.func.required,
  username: PropTypes.string.required,
  mobileDisplay: PropTypes.func.required
};

export default MobileToolbar;
