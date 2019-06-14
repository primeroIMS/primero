import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery
} from "@material-ui/core";
import { AgencyLogo } from "components/agency-logo";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { ModuleLogo } from "components/module-logo";
import { NavLink } from "react-router-dom";
import { withI18n, themeHelper } from "libs";
import { connect } from "react-redux";
import { MobileToolbar } from "components/mobile-toolbar";
import { ListIcon } from "components/list-icon";
import { AccountMenu } from "components/account-menu";
import { TranslationsToggle } from "../translations-toggle";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Nav = ({ i18n, username, drawerOpen, openDrawer }) => {
  const { css, theme } = themeHelper(styles);
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));

  const nav = [
    { name: i18n.t("navigation.home"), to: "/", icon: "home" },
    { name: i18n.t("navigation.tasks"), to: "/tasks", icon: "tasks" },
    { name: i18n.t("navigation.cases"), to: "/cases", icon: "cases" },
    {
      name: i18n.t("navigation.incidents"),
      to: "/incidents",
      icon: "incidents"
    },
    {
      name: i18n.t("navigation.tracing_request"),
      to: "/tracing-requests",
      icon: "tracing_request"
    },
    {
      name: i18n.t("navigation.potential_match"),
      to: "/matches",
      icon: "matches"
    },
    { name: i18n.t("navigation.reports"), to: "/reports", icon: "reports" },
    { name: i18n.t("navigation.bulk_exports"), to: "/exports", icon: "exports" }
  ];

  useEffect(() => {
    if (!mobileDisplay && !drawerOpen) {
      openDrawer(true);
    }
  });

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
          ))}
        </List>
        {!mobileDisplay && <AccountMenu username={username} />}
        {/* TODO: Need to pass agency and logo path from api */}
        <AgencyLogo />
        {!mobileDisplay && <TranslationsToggle />}
      </Drawer>
    </>
  );
};

Nav.propTypes = {
  i18n: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired
};

// TODO: Username should come from redux once user built.
const mapStateToProps = state => ({
  username: "primero_cp",
  drawerOpen: Selectors.selectDrawerOpen(state)
});

const mapDispatchToProps = {
  openDrawer: actions.openDrawer
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Nav)
);
