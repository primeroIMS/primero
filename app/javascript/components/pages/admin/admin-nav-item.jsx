import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import { forwardRef, useMemo } from "react";

import { useI18n } from "../../i18n";
import { useApp } from "../../application";

const AdminNavItem = ({ item, isParent, open, handleClick, nestedClass }) => {
  const i18n = useI18n();
  const { disabledApplication } = useApp();

  const Link = useMemo(
    () =>
      forwardRef((linkProps, ref) => (
        <NavLink ref={ref} to={`/admin${item.to}`} {...linkProps} activeClassName="Mui-selected" />
      )),
    [item.to]
  );

  const listItemProps = {
    key: item.to,
    button: true,
    disabled: item.disabled || disabledApplication,
    ...(isParent ? { onClick: handleClick } : { component: Link })
  };

  const handleOpen = open ? <ExpandLess /> : <ExpandMore />;

  return (
    <ListItem {...listItemProps}>
      <ListItemText className={nestedClass || null}>{i18n.t(item.label)}</ListItemText>
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
