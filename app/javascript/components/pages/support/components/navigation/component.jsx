import PropTypes from "prop-types";
import { List, ListItem, ListItemText, Drawer } from "@material-ui/core";

import { ConditionalWrapper } from "../../../../../libs";

import { NAME } from "./constants";

const Component = ({ css, handleToggleNav, menuList, mobileDisplay, onClick, selectedItem, toggleNav }) => {
  const drawerProps = {
    anchor: "left",
    open: toggleNav,
    onClose: handleToggleNav,
    classes: {
      paper: css.mobileNav
    }
  };

  const renderList = menuList.map(({ id, text, disabled, hidden }) => {
    if (hidden) {
      return null;
    }

    const handleClick = () => onClick(id);
    const selected = selectedItem === id;
    const classes = {
      button: css.item,
      selected: css.selectedItem
    };

    return (
      <ListItem button key={id} onClick={handleClick} selected={selected} disabled={disabled} classes={classes}>
        <ListItemText key={id} primary={text} />
      </ListItem>
    );
  });

  return (
    <ConditionalWrapper condition={mobileDisplay} wrapper={Drawer} {...drawerProps}>
      <List component="nav">{renderList}</List>
    </ConditionalWrapper>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  css: PropTypes.object,
  handleToggleNav: PropTypes.func,
  menuList: PropTypes.array,
  mobileDisplay: PropTypes.bool,
  onClick: PropTypes.func,
  selectedItem: PropTypes.string,
  toggleNav: PropTypes.bool
};

export default Component;
