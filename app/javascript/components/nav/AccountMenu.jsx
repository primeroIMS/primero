import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PropTypes from "prop-types";
import React from "react";
import { NavLink } from "react-router-dom";
import { withI18n } from "libs";
import ListIcon from "./ListIcon";
import * as styles from "./styles.module.scss";

const AccountMenu = ({ i18n, username }) => {
  const nav = [
    { name: i18n.t("navigation.my_account"), to: "/account" },
    { name: i18n.t("navigation.logout"), to: "/signout" }
  ];

  return (
    <>
      <div className={styles.navSeparator} />
      <List className={styles.navListAccount}>
        <ListItem>
          <NavLink
            to="/support"
            className={styles.navLink}
            activeClassName={styles.navActive}
            exact
          >
            <ListItemIcon classes={{ root: styles.listIcon }}>
              <ListIcon icon="support" />
            </ListItemIcon>
            <ListItemText
              primary={i18n.t("navigation.support")}
              classes={{ primary: styles.listText }}
            />
          </NavLink>
        </ListItem>
        <ListItem className={styles.readOnlyNavListItem}>
          <ListItemIcon classes={{ root: styles.listIcon }}>
            <ListIcon icon="account" />
          </ListItemIcon>
          <ListItemText
            primary={username}
            classes={{ primary: styles.listText }}
          />
        </ListItem>
        {nav.map(l => (
          <ListItem className={styles.accountListItem} key={l.to}>
            <NavLink
              to={l.to}
              className={styles.navLink}
              activeClassName={styles.navActive}
              exact
            >
              <ListItemText
                primary={l.name}
                classes={{ primary: styles.listText }}
              />
            </NavLink>
          </ListItem>
        ))}
      </List>
    </>
  );
};

AccountMenu.propTypes = {
  i18n: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired
};

export default withI18n(AccountMenu);
