// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { forwardRef, useMemo } from "react";

import { useI18n } from "../../i18n";
import { useApp } from "../../application";
import Jewel from "../../jewel";

import css from "./styles.css";

function AdminNavItem({ item, isParent = false, open, handleClick, nestedClass, renderJewel }) {
  const i18n = useI18n();
  const { disabledApplication } = useApp();

  const Link = useMemo(
    () =>
      // eslint-disable-next-line react/no-multi-comp,react/display-name
      forwardRef((linkProps, ref) => (
        <NavLink ref={ref} to={`/admin${item.to}`} {...linkProps} activeClassName="Mui-selected" />
      )),
    [item.to]
  );

  const listItemProps = {
    button: true,
    disabled: item.disabled || disabledApplication,
    ...(isParent ? { onClick: handleClick } : { component: Link }),
    classes: {
      selected: css.selectedItem
    }
  };

  const handleOpen = open ? <ExpandLess /> : <ExpandMore />;
  const jewel = renderJewel ? <Jewel value={renderJewel} isForm /> : null;

  return (
    <ListItem {...listItemProps} key={item.to}>
      <ListItemText className={nestedClass || null}>{i18n.t(item.label)}</ListItemText>
      {isParent ? handleOpen : null}
      {jewel}
    </ListItem>
  );
}

AdminNavItem.displayName = "AdminNavItem";

AdminNavItem.propTypes = {
  handleClick: PropTypes.func,
  isParent: PropTypes.bool,
  item: PropTypes.object.isRequired,
  nestedClass: PropTypes.string,
  open: PropTypes.bool,
  renderJewel: PropTypes.bool
};

export default AdminNavItem;
