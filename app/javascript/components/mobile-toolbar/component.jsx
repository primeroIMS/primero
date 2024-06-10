// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Toolbar, IconButton, Hidden } from "@mui/material";
import PropTypes from "prop-types";

import NetworkIndicator from "../network-indicator";
import ModuleLogo from "../module-logo";
import { useApp } from "../application";
import { useI18n } from "../i18n";
import { DEMO } from "../application/constants";
import Jewel from "../jewel";

import css from "./styles.css";

const MobileToolbar = ({ openDrawer, hasUnsubmittedOfflineChanges = false }) => {
  const { demo } = useApp();
  const i18n = useI18n();

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const demoText = demo ? <div className={css.demoText}>{i18n.t(DEMO)}</div> : null;

  return (
    <Hidden mdUp implementation="css">
      <AppBar position="fixed" data-testid="appBar">
        <Toolbar data-testid="toolbar" className={css[demo ? "toolbar-demo" : "toolbar"]}>
          <IconButton edge="start" color="default" aria-label="Menu" onClick={openDrawer}>
            <MenuIcon className={css.hamburger} />
            {hasUnsubmittedOfflineChanges && (
              <div className={css.menuAlert}>
                <Jewel value mobileDisplay isForm />
              </div>
            )}
          </IconButton>
          <div className={css.appBarContent}>
            <ModuleLogo className={css.logo} />
            {demoText}
            <NetworkIndicator mobile />
          </div>
        </Toolbar>
      </AppBar>
    </Hidden>
  );
};

MobileToolbar.displayName = "MobileToolbar";

MobileToolbar.propTypes = {
  hasUnsubmittedOfflineChanges: PropTypes.bool,
  openDrawer: PropTypes.func.isRequired
};

export default MobileToolbar;
