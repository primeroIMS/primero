import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { withI18n } from "libs";
import { TranslationsToggle } from "../translations-toggle";
import * as styles from "./styles.module.scss";

const Nav = ({ i18n }) => {
  const nav = [
    { name: i18n.t("navigation.home"), to: "/" },
    { name: i18n.t("navigation.cases"), to: "/cases" },
    { name: i18n.t("navigation.incidents"), to: "/incidents" }
  ];

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: styles.drawerPaper
      }}
    >
      <List className={styles.navList}>
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
  i18n: PropTypes.object.isRequired
};

export default withI18n(Nav);
