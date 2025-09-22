// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { List, ListItemText, Drawer } from "@mui/material";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";

import { ConditionalWrapper } from "../../libs";

import { NAME } from "./constants";
import css from "./styles.css";

function Component({ handleToggleNav, menuList = [], mobileDisplay = false, selected, toggleNav }) {
  const drawerProps = {
    anchor: "left",
    open: toggleNav,
    onClose: handleToggleNav,
    classes: {
      paper: css.mobileNav
    }
  };

  const renderList = menuList.map(({ text, disabled, hidden, to }) => {
    if (hidden) {
      return null;
    }

    const classes = {
      button: css.item,
      selected: css.selectedItem
    };

    return (
      <ListItemButton
        data-testid="list-item"
        key={to}
        component={Link}
        to={to}
        selected={selected === to}
        disabled={disabled}
        classes={classes}
      >
        <ListItemText primary={text} data-testid="list-item-text" />
      </ListItemButton>
    );
  });

  return (
    <ConditionalWrapper condition={mobileDisplay} wrapper={Drawer} {...drawerProps}>
      <List component="nav" data-testid="list">
        {renderList}
      </List>
    </ConditionalWrapper>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  handleToggleNav: PropTypes.func,
  menuList: PropTypes.array,
  mobileDisplay: PropTypes.bool,
  onClick: PropTypes.func,
  selected: PropTypes.string,
  toggleNav: PropTypes.bool
};

export default Component;
