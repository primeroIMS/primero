import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { ExpandMore, ExpandLess } from "@material-ui/icons";

import { useI18n } from "../../i18n";

const AdminNavItem = ({ item, isParent, open, handleClick, nestedClass }) => {
  const i18n = useI18n();

  const sharedProps = {
    key: item.to,
    button: true,
    activeClassName: "Mui-selected",
    disabled: item.disabled
  };

  let customProps = {};

  customProps = isParent
    ? { onClick: handleClick }
    : { component: NavLink, to: `/admin${item.to}` };

  const handleOpen = open ? <ExpandLess /> : <ExpandMore />;

  return (
    <ListItem {...customProps} {...sharedProps}>
      <ListItemText className={nestedClass || null}>
        {i18n.t(item.label)}
      </ListItemText>
      {isParent ? handleOpen : null}
    </ListItem>
  );
};

AdminNavItem.displayName = "AdminNavItem";

AdminNavItem.defaultProps = {
  isParent: false
};

AdminNavItem.propTypes = {
  handleClick: PropTypes.func,
  isParent: PropTypes.bool,
  item: PropTypes.object.isRequired,
  nestedClass: PropTypes.string,
  open: PropTypes.bool
};

export default AdminNavItem;
