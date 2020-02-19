import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { NavLink } from "react-router-dom";

import { ADMIN_NAV } from "../../../config/constants";
import { useI18n } from "../../i18n";

const AdminNav = () => {
  const i18n = useI18n();

  const renderNavItems = ADMIN_NAV.map(nav => (
    <ListItem
      key={nav.to}
      button
      component={NavLink}
      to={`/admin${nav.to}`}
      activeClassName="Mui-selected"
      disabled={nav.disabled}
    >
      <ListItemText>{i18n.t(nav.label)}</ListItemText>
    </ListItem>
  ));

  return <List>{renderNavItems}</List>;
};

AdminNav.displayName = "AdminNav";

export default AdminNav;
