import React from "react";
import { useSelector } from "react-redux";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { NavLink } from "react-router-dom";

import { getPermissionsByRecord } from "../../user/selectors";
import { ADMIN_NAV } from "../../../config/constants";
import { useI18n } from "../../i18n";
import { MANAGE, RESOURCES, checkPermissions } from "../../../libs/permissions";

const AdminNav = () => {
  const i18n = useI18n();

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, RESOURCES.systems)
  );

  const hasManagePermission = checkPermissions(userPermissions, MANAGE);

  const renderNavItems = ADMIN_NAV.map(nav => {
    if (!hasManagePermission && nav.manageRequired) {
      return null;
    }

    return (
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
    );
  });

  return <List>{renderNavItems}</List>;
};

AdminNav.displayName = "AdminNav";

export default AdminNav;
