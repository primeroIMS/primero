import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";

import { useI18n } from "../../i18n";

const AdminNav = () => {
  const i18n = useI18n();

  return (
    <List>
      <ListItem
        button
        component={props => <Link to="/admin/users" {...props} />}
      >
        <ListItemText>{i18n.t("users.label")}</ListItemText>
      </ListItem>
    </List>
  );
};

AdminNav.displayName = "AdminNav";

AdminNav.propTypes = {};

export default AdminNav;
