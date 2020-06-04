import { Drawer, List, useMediaQuery } from "@material-ui/core";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import AgencyLogo from "../agency-logo";
import ModuleLogo from "../module-logo";
import { useThemeHelper } from "../../libs";
import MobileToolbar from "../mobile-toolbar";
import { useApp } from "../application";
import Permission from "../application/permission";
import TranslationsToggle from "../translations-toggle";
import { PERMITTED_URL, APPLICATION_NAV } from "../../config";
import { getPermissions } from "../user";

import { NAME } from "./constants";
import styles from "./styles.css";
import {
  openDrawer as openDrawerActionCreator,
  fetchAlerts
} from "./action-creators";
import { selectDrawerOpen, selectUsername, selectAlerts } from "./selectors";
import MenuEntry from "./components/menu-entry";

const Nav = () => {
  const { css, theme } = useThemeHelper(styles);
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const openDrawer = useCallback(
    value => dispatch(openDrawerActionCreator(value)),
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchAlerts());
  }, []);

  const { userModules } = useApp();
  const module = userModules.first();

  // TODO: Username should come from redux once user built.
  const username = useSelector(state => selectUsername(state));
  const drawerOpen = useSelector(state => selectDrawerOpen(state));
  const dataAlerts = useSelector(state => selectAlerts(state));
  const permissions = useSelector(state => getPermissions(state));

  useEffect(() => {
    if (!mobileDisplay && !drawerOpen) {
      openDrawer(true);
    }
  }, [drawerOpen, mobileDisplay, openDrawer]);

  const permittedMenuEntries = menuEntries => {
    return menuEntries.map(menuEntry => {
      const jewel = dataAlerts.get(menuEntry?.jewelCount, null);
      const renderedMenuEntries = (
        <MenuEntry
          key={menuEntry.to}
          menuEntry={menuEntry}
          mobileDisplay={mobileDisplay}
          jewelCount={jewel}
          username={username}
        />
      );

      return PERMITTED_URL.includes(menuEntry.to) ? (
        renderedMenuEntries
      ) : (
        <Permission
          key={menuEntry.to}
          resources={menuEntry.resources}
          actions={menuEntry.actions}
        >
          {renderedMenuEntries}
        </Permission>
      );
    });
  };

  return (
    <>
      <MobileToolbar
        drawerOpen={drawerOpen}
        openDrawer={openDrawer}
        mobileDisplay={mobileDisplay}
      />
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: css.drawerPaper
        }}
      >
        {!mobileDisplay && (
          <ModuleLogo
            moduleLogo={module ? module.unique_id : "primero"}
            username={username}
          />
        )}
        <List className={css.navList}>
          {permittedMenuEntries(APPLICATION_NAV(permissions))}
        </List>
        <div className={css.navAgencies}>
          <AgencyLogo />
        </div>
        {!mobileDisplay && <TranslationsToggle />}
      </Drawer>
    </>
  );
};

Nav.displayName = NAME;

export default Nav;
