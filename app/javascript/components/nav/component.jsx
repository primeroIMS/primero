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
import ListIcon from "./ListIcon";
import { TranslationsToggle } from "../translations-toggle";
import * as styles from "./styles.module.scss";
import AccountMenu from "./AccountMenu";

const Nav = ({ i18n, username }) => {
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

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: styles.drawerPaper
      }}
    >
      <ModuleLogo moduleLogo="primero" />
      <List className={styles.navList}>
        {nav.map(l => (
          <ListItem key={l.to}>
            <NavLink
              to={l.to}
              className={styles.navLink}
              activeClassName={styles.navActive}
              exact
            >
              <ListItemIcon classes={{ root: styles.listIcon }}>
                <ListIcon icon={l.icon} />
              </ListItemIcon>
              <ListItemText
                primary={l.name}
                classes={{ primary: styles.listText }}
              />
            </NavLink>
          </ListItem>
        ))}
      </List>
      <AccountMenu username={username} />
      {/* TODO: Need to pass agency and logo path from api */}
      <AgencyLogo />
      <TranslationsToggle />
    </Drawer>
  );
};

Nav.propTypes = {
  i18n: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired
};

// TODO: Username should come from redux once user built.
const mapStateToProps = () => {
  return {
    username: "primero_cp"
  };
};

export default withI18n(connect(mapStateToProps)(Nav));
