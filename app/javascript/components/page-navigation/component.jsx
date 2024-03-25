// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { List, ListItem, ListItemText, Drawer } from "@material-ui/core";
import { Link } from "react-router-dom";

import { ConditionalWrapper } from "../../libs";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ handleToggleNav, menuList = [], mobileDisplay = false, selected, toggleNav }) => {
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
      <ListItem
        data-testid="list-item"
        button
        key={to}
        component={Link}
        to={to}
        selected={selected === to}
        disabled={disabled}
        classes={classes}
      >
        <ListItemText primary={text} data-testid="list-item-text" />
      </ListItem>
    );
  });

  return (
    <ConditionalWrapper condition={mobileDisplay} wrapper={Drawer} {...drawerProps}>
      <List component="nav" data-testid="list">{renderList}</List>
    </ConditionalWrapper>
  );
};

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
