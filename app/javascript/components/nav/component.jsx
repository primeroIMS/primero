import { Drawer, List, useMediaQuery, Hidden, Divider, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../i18n";
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
import { fetchAlerts } from "./action-creators";
import { selectUsername, selectAlerts } from "./selectors";
import MenuEntry from "./components/menu-entry";

const Nav = () => {
  const { css, theme } = useThemeHelper(styles);
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const i18n = useI18n();

  useEffect(() => {
    dispatch(fetchAlerts());
  }, []);

  const { userModules } = useApp();
  const module = userModules.first();

  const username = useSelector(state => selectUsername(state));
  const dataAlerts = useSelector(state => selectAlerts(state));
  const permissions = useSelector(state => getPermissions(state));

  const handleToggleDrawer = open => event => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setDrawerOpen(open);
  };

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
          closeDrawer={handleToggleDrawer(false)}
        />
      );

      return PERMITTED_URL.includes(menuEntry.to) ? (
        renderedMenuEntries
      ) : (
        <Permission key={menuEntry.to} resources={menuEntry.resources} actions={menuEntry.actions}>
          {renderedMenuEntries}
        </Permission>
      );
    });
  };

  const drawerContent = (
    <>
      <Hidden smDown implementation="css">
        <ModuleLogo moduleLogo={module ? module.unique_id : "primero"} username={username} />
      </Hidden>
      <div className={css.drawerHeaderContainer}>
        <Hidden mdUp implementation="css">
          <div className={css.drawerHeader}>
            <IconButton aria-label={i18n.t("buttons.menu")} onClick={handleToggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <Divider />
        </Hidden>
      </div>
      <List className={css.navList}>{permittedMenuEntries(APPLICATION_NAV(permissions))}</List>
      <div className={css.navAgencies}>
        <AgencyLogo />
      </div>
      <Hidden smDown implementation="css">
        <TranslationsToggle />
      </Hidden>
    </>
  );

  const commonDrawerProps = {
    anchor: "left",
    open: drawerOpen,
    classes: {
      root: css.drawerRoot,
      paper: css.drawerPaper
    },
    onClose: handleToggleDrawer(false)
  };

  return (
    <nav>
      <MobileToolbar openDrawer={handleToggleDrawer(true)} />
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          {...commonDrawerProps}
          ModalProps={{
            keepMounted: true
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer variant="permanent" {...commonDrawerProps}>
          {drawerContent}
        </Drawer>
      </Hidden>
    </nav>
  );
};

Nav.displayName = NAME;

export default Nav;
