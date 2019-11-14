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
import Permission from "../application/permission"
import { ListIcon } from "../list-icon";
import { Jewel } from "../jewel";
import { TranslationsToggle } from "../translations-toggle";
import { PERMITTED_URL, ROUTES } from "../../config";
import { PERMISSION_CONSTANTS, RESOURCES } from "../../libs/permissions";

import { NAME } from "./constants";
import styles from "./styles.css";
import * as actions from "./action-creators";
import {
  selectDrawerOpen,
  selectUsername,
  selectUserAgency
} from "./selectors";

const Nav = () => {
  const { css, theme } = useThemeHelper(styles);
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const i18n = useI18n();
  const dispatch = useDispatch();

  const openDrawer = useCallback(value => dispatch(actions.openDrawer(value)), [
    dispatch
  ]);

  const { userModules } = useApp();
  const module = userModules.first();

  // TODO: Username should come from redux once user built.
  const username = useSelector(state => selectUsername(state));
  const agency = useSelector(state => selectUserAgency(state));
  const drawerOpen = useSelector(state => selectDrawerOpen(state));
  const nav = [
    { name: i18n.t("navigation.home"), to: ROUTES.dashboard, icon: "home" },
    {
      name: i18n.t("navigation.tasks"),
      to: ROUTES.tasks,
      icon: "tasks",
      jewelCount: 0,
      permissionType: RESOURCES.dashboards,
      permission: [PERMISSION_CONSTANTS.DASH_TASKS, PERMISSION_CONSTANTS.MANAGE]
    },
    {
      name: i18n.t("navigation.cases"),
      to: ROUTES.cases,
      icon: "cases",
      jewelCount: 20,
      permissionType: RESOURCES.cases,
      permission: [PERMISSION_CONSTANTS.READ, PERMISSION_CONSTANTS.MANAGE]
    },
    {
      name: i18n.t("navigation.incidents"),
      to: ROUTES.incidents,
      icon: "incidents",
      jewelCount: 0,
      permissionType: RESOURCES.incidents,
      permission: [PERMISSION_CONSTANTS.READ, PERMISSION_CONSTANTS.MANAGE]
    },
    {
      name: i18n.t("navigation.tracing_request"),
      to: ROUTES.tracing_requests,
      icon: "tracing_request",
      permissionType: RESOURCES.tracing_requests,
      permission: [PERMISSION_CONSTANTS.READ, PERMISSION_CONSTANTS.MANAGE]
    },
    {
      name: i18n.t("navigation.potential_match"),
      to: ROUTES.matches,
      icon: "matches",
      permissionType: RESOURCES.potential_matches,
      permission: [PERMISSION_CONSTANTS.READ, PERMISSION_CONSTANTS.MANAGE]
    },
    {
      name: i18n.t("navigation.reports"),
      to: ROUTES.reports,
      icon: "reports",
      permissionType: RESOURCES.reports,
      permission: [
        PERMISSION_CONSTANTS.READ,
        PERMISSION_CONSTANTS.GROUP_READ,
        PERMISSION_CONSTANTS.MANAGE
      ]
    },
    {
      name: i18n.t("navigation.bulk_exports"),
      to: ROUTES.exports,
      icon: "exports",
      permissionType: [
        RESOURCES.cases,
        RESOURCES.incidents,
        RESOURCES.tracing_requests
      ],
      permission: [
        PERMISSION_CONSTANTS.EXPORT_LIST_VIEW,
        PERMISSION_CONSTANTS.EXPORT_CSV,
        PERMISSION_CONSTANTS.EXPORT_EXCEL,
        PERMISSION_CONSTANTS.EXPORT_JSON,
        PERMISSION_CONSTANTS.EXPORT_PHOTO_WALL,
        PERMISSION_CONSTANTS.EXPORT_PDF,
        PERMISSION_CONSTANTS.EXPORT_UNHCR,
        PERMISSION_CONSTANTS.EXPORT_DUPLICATE_ID,
        PERMISSION_CONSTANTS.EXPORT_CASE_PDF,
        PERMISSION_CONSTANTS.EXPORT_MRM_VIOLATION_XLS,
        PERMISSION_CONSTANTS.EXPORT_INCIDENT_RECORDER,
        PERMISSION_CONSTANTS.EXPORT_CUSTOM,
        PERMISSION_CONSTANTS.MANAGE
      ]
    },
    {
      name: i18n.t("navigation.support"),
      to: ROUTES.support,
      icon: "support",
      divider: true
    },
    { name: username, to: ROUTES.account, icon: "account" },
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
            <Jewel
              value={menuEntry.jewelCount}
              mobileDisplay={mobileDisplay}
            />
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
          permissionType={menuEntry.permissionType}
          permission={menuEntry.permission}
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
