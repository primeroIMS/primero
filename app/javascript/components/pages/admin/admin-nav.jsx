import React, { useState } from "react";
import { List, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { ADMIN_NAV } from "../../../config/constants";

import styles from "./styles.css";
import AdminNavItem from "./admin-nav-item";

const AdminNav = () => {
  const css = makeStyles(styles)();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const renderNavItems = ADMIN_NAV.map(nav => {
    const isParent = "items" in nav;

    if (isParent) {
      const renderChildren = nav.items.map(navItem => (
        <AdminNavItem
          key={`${navItem.to}-child`}
          item={navItem}
          nestedClass={css.nestedItem}
        />
      ));

      return (
        <>
          <AdminNavItem
            key={`${nav.to}-parent`}
            item={nav}
            open={open}
            handleClick={handleClick}
            isParent
          />
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderChildren}
            </List>
          </Collapse>
        </>
      );
    }

    return <AdminNavItem key={`${nav.to}-group`} item={nav} />;
  });

  return <List>{renderNavItems}</List>;
};

AdminNav.displayName = "AdminNav";

export default AdminNav;
