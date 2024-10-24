// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { List, ListItem, ListItemText, Drawer } from "@mui/material";

import { ConditionalWrapper, useMemoizedSelector } from "../../../../../libs";
import Jewel from "../../../../jewel";
import { hasQueueData } from "../../../../connectivity/selectors";
import { SUPPORT_FORMS } from "../../constants";

import { NAME } from "./constants";

function Component({ css, handleToggleNav, menuList, mobileDisplay, onClick, selectedItem, toggleNav }) {
  const hasUnsubmittedOfflineChanges = useMemoizedSelector(state => hasQueueData(state));

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
      <ListItem
        data-testid="list-item"
        button
        key={id}
        onClick={handleClick}
        selected={selected}
        disabled={disabled}
        classes={classes}
      >
        <ListItemText key={id} primary={text} />
        {hasUnsubmittedOfflineChanges && id === SUPPORT_FORMS.resync && <Jewel isForm />}
      </ListItem>
    );
  });

  return (
    <ConditionalWrapper condition={mobileDisplay} wrapper={Drawer} {...drawerProps}>
      <List data-testid="list" component="nav">
        {renderList}
      </List>
    </ConditionalWrapper>
  );
}

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
