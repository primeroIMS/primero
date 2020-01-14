import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery
} from "@material-ui/core";
import React, { useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AgencyLogo } from "../agency-logo";
import { ModuleLogo } from "../module-logo";
import { useI18n } from "../i18n";
import { useThemeHelper } from "../../libs";
import { MobileToolbar } from "../mobile-toolbar";
import { useApp } from "../application";
import Permission from "../application/permission";
import { ListIcon } from "../list-icon";
import { Jewel } from "../jewel";
import { TranslationsToggle } from "../translations-toggle";
import { PERMITTED_URL, ROUTES } from "../../config";
import {
  RECORD_RESOURCES,
  READ_RECORDS,
  READ_REPORTS,
  RESOURCES,
  SHOW_EXPORTS,
  SHOW_TASKS,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS
} from "../../libs/permissions";

import { NAME } from "./constants";
import styles from "./styles.css";
import * as actions from "./action-creators";
import {
  selectDrawerOpen,
  selectUsername,
  selectUserAgency,
  selectAlerts
} from "./selectors";

const Nav = () => {
  const { css, theme } = useThemeHelper(styles);
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const i18n = useI18n();
  const dispatch = useDispatch();

  const openDrawer = useCallback(value => dispatch(actions.openDrawer(value)), [
    dispatch
  ]);

  useEffect(() => {
    dispatch(actions.fetchAlerts());
  }, []);

  const { userModules } = useApp();
  const module = userModules.first();

  // TODO: Username should come from redux once user built.
  const username = useSelector(state => selectUsername(state));
  const agency = useSelector(state => selectUserAgency(state));
  const drawerOpen = useSelector(state => selectDrawerOpen(state));
  const dataAlerts = useSelector(state => selectAlerts(state));
  const nav = [
    { name: i18n.t("navigation.home"), to: ROUTES.dashboard, icon: "home" },
    {
      name: i18n.t("navigation.tasks"),
      to: ROUTES.tasks,
      icon: "tasks",
      resources: RESOURCES.dashboards,
      actions: SHOW_TASKS
    },
    {
      name: i18n.t("navigation.cases"),
      to: ROUTES.cases,
      icon: "cases",
      jewelCount: dataAlerts.get("case"),
      resources: RESOURCES.cases,
      actions: READ_RECORDS
    },
    {
      name: i18n.t("navigation.incidents"),
      to: ROUTES.incidents,
      icon: "incidents",
      jewelCount: dataAlerts.get("incident"),
      resources: RESOURCES.incidents,
      actions: READ_RECORDS
    },
    {
      name: i18n.t("navigation.tracing_request"),
      to: ROUTES.tracing_requests,
      icon: "tracing_request",
      jewelCount: dataAlerts.get("tracing_request"),
      resources: RESOURCES.tracing_requests,
      actions: READ_RECORDS
    },
    {
      name: i18n.t("navigation.potential_match"),
      to: ROUTES.matches,
      icon: "matches",
      resources: RESOURCES.potential_matches,
      actions: READ_RECORDS
    },
    {
      name: i18n.t("navigation.reports"),
      to: ROUTES.reports,
      icon: "reports",
      resources: RESOURCES.reports,
      actions: READ_REPORTS
    },
    {
      name: i18n.t("navigation.bulk_exports"),
      to: ROUTES.exports,
      icon: "exports",
      resources: RECORD_RESOURCES,
      actions: SHOW_EXPORTS
    },
    {
      name: i18n.t("navigation.support"),
      to: ROUTES.support,
      icon: "support",
      divider: true
    },
    { name: username, to: ROUTES.account, icon: "account" },
    {
      name: i18n.t("navigation.settings"),
      to: ROUTES.admin_users,
      icon: "settings",
      resources: ADMIN_RESOURCES,
      actions: ADMIN_ACTIONS
    },
    { name: i18n.t("navigation.logout"), to: ROUTES.logout, icon: "logout" }
  ];

  useEffect(() => {
    if (!mobileDisplay && !drawerOpen) {
      openDrawer(true);
    }
  }, [drawerOpen, mobileDisplay, openDrawer]);

  const renderMenuEntries = menuEntry => (
    <div key={menuEntry.to}>
      {menuEntry.divider && <div className={css.navSeparator} />}
      <ListItem key={menuEntry.to}>
        <NavLink
          to={menuEntry.to}
          className={css.navLink}
          activeClassName={css.navActive}
        >
          <ListItemIcon classes={{ root: css.listIcon }}>
            <ListIcon icon={menuEntry.icon} />
          </ListItemIcon>
          <ListItemText
            primary={menuEntry.name}
            classes={{ primary: css.listText }}
          />
          {menuEntry.jewelCount ? (
            <Jewel value={menuEntry.jewelCount} mobileDisplay={mobileDisplay} />
          ) : null}
        </NavLink>
      </ListItem>
    </div>
  );

  const permittedMenuEntries = menuEntries => {
    return menuEntries.map(menuEntry => {
      const renderedMenuEntries = renderMenuEntries(menuEntry);

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
        <List className={css.navList}>{permittedMenuEntries(nav)}</List>

        {agency && agency.get("logo") && (
          <AgencyLogo
            agency={agency && agency.get("unique_id")}
            logo={`${(agency.get("logo") &&
              agency.getIn(["logo", "small"], "")) ||
              ""}`}
          />
        )}
        {!mobileDisplay && <TranslationsToggle />}
      </Drawer>
    </>
  );
};

Nav.displayName = NAME;

export default Nav;
