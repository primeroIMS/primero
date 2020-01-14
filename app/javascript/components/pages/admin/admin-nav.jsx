import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";

import { useI18n } from "../../i18n";

const AdminNav = () => {
  const i18n = useI18n();

  return (
    <List>
      <ListItem button component={Link} to="/admin/users">
        <ListItemText>{i18n.t("users.label")}</ListItemText>
      </ListItem>
    </List>
  );
};

AdminNav.displayName = "AdminNav";

export default AdminNav;
