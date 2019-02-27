import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import { withI18n } from "libs/i18n";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { TranslationsToggle } from "../translations-toggle";

const drawerWidth = 240;

const styles = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  navList: {
    flexGrow: 1
  }
};

const Nav = ({ classes, i18n }) => {
  const nav = [
    { name: i18n.t("navigation.home"), to: "/" },
    { name: i18n.t("navigation.cases"), to: "/cases" },
    { name: i18n.t("navigation.incidents"), to: "/incidents" }
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <List className={classes.navList}>
        {nav.map(l => (
          <ListItem button component={Link} to={l.to} key={l.name}>
            <ListItemText primary={l.name} />
          </ListItem>
        ))}
      </List>
      <TranslationsToggle />
    </Drawer>
  );
};

Nav.propTypes = {
  classes: PropTypes.instanceOf(styles).isRequired,
  i18n: PropTypes.instanceOf(window.I18n).isRequired
};

export default compose(
  withI18n,
  withStyles(styles)
)(Nav);
