import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { AgencyLogo } from "components/agency-logo";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PropTypes from "prop-types";
import React from "react";
import { ModuleLogo } from "components/module-logo";
import { NavLink } from "react-router-dom";
import { withI18n } from "libs";
import { connect } from "react-redux";
import makeStyles from "@material-ui/styles/makeStyles";
import useTheme from "@material-ui/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { MobileToolbar } from "components/mobile-toolbar";
import { ListIcon } from "components/list-icon";
import { AccountMenu } from "components/account-menu";
import { TranslationsToggle } from "../translations-toggle";
import styles from "./styles.jss";
import namespace from "./namespace";
import * as actions from "./action-creators";

const Nav = ({ i18n, username, drawerOpen, openDrawer }) => {
  const css = makeStyles(styles)();
  const theme = useTheme();
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

  if (!mobileDisplay && !drawerOpen) {
    openDrawer(true);
  }

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
const mapStateToProps = state => {
  return {
    username: "primero_cp",
    drawerOpen: state.get(namespace).toJS().drawerOpen
  };
};

const mapDispatchToProps = {
  openDrawer: actions.openDrawer
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Nav)
);
