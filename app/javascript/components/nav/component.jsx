import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery
} from "@material-ui/core";
import { AgencyLogo } from "components/agency-logo";
import React, { useEffect } from "react";
import { ModuleLogo } from "components/module-logo";
import { NavLink } from "react-router-dom";
import { useI18n } from "components/i18n";
import { themeHelper } from "libs";
import { useDispatch, useSelector } from "react-redux";
import { MobileToolbar } from "components/mobile-toolbar";
import { ListIcon } from "components/list-icon";
import { TranslationsToggle } from "../translations-toggle";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Nav = () => {
  const { css, theme } = themeHelper(styles);
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const i18n = useI18n();
  const dispatch = useDispatch();

  const nav = [
    { name: i18n.t("navigation.home"), to: "/dashboard", icon: "home" },
    { name: i18n.t("navigation.tasks"), to: "/tasks", icon: "tasks" },
    { name: i18n.t("navigation.cases"), to: "/cases", icon: "cases" },
    {
      name: i18n.t("navigation.incidents"),
      to: "/incidents",
      icon: "incidents"
    },
    {
      name: i18n.t("navigation.tracing_request"),
      to: "/tracing_requests",
      icon: "tracing_request"
    },
    {
      name: i18n.t("navigation.potential_match"),
      to: "/matches",
      icon: "matches"
    },
    { name: i18n.t("navigation.reports"), to: "/reports", icon: "reports" },
    {
      name: i18n.t("navigation.bulk_exports"),
      to: "/exports",
      icon: "exports"
    },
    {
      name: i18n.t("navigation.support"),
      to: "/support",
      icon: "support",
      divider: true
    },
    { name: i18n.t("navigation.my_account"), to: "/account", icon: "account" },
    { name: i18n.t("navigation.logout"), to: "/signout", icon: "logout" }
  ];

  const openDrawer = value => dispatch(actions.openDrawer(value));
  // TODO: Username should come from redux once user built.
  const username = useSelector(() => "primero_cp");
  const drawerOpen = useSelector(state => Selectors.selectDrawerOpen(state));

  useEffect(() => {
    if (!mobileDisplay && !drawerOpen) {
      openDrawer(true);
    }
  }, [mobileDisplay]);

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
          <ModuleLogo moduleLogo="primero" username={username} />
        )}
        <List className={css.navList}>
          {nav.map(l => (
            <div key={l.to}>
              {l.divider && <div className={css.navSeparator} />}
              <ListItem key={l.to}>
                <NavLink
                  to={l.to}
                  className={css.navLink}
                  activeClassName={css.navActive}
                  exact
                >
                  <ListItemIcon classes={{ root: css.listIcon }}>
                    <ListIcon icon={l.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary={l.name}
                    classes={{ primary: css.listText }}
                  />
                </NavLink>
              </ListItem>
            </div>
          ))}
        </List>
        {/* TODO: Need to pass agency and logo path from api */}
        <AgencyLogo />
        {!mobileDisplay && <TranslationsToggle />}
      </Drawer>
    </>
  );
};

export default Nav;
