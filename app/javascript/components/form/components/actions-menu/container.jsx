import { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { NAME } from "./constants";

const Container = ({ actionItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemAction = itemAction => {
    handleClose();
    itemAction();
  };

  const actionMenuItems = () => {
    const handleMenuItemClick = currAction => () => handleItemAction(currAction.action);

    return actionItems
      .filter(action => typeof action.condition === "undefined" || action.condition)
      .map(action => {
        return (
          <MenuItem key={action.name} selected={action.name === "Pyxis"} onClick={handleMenuItemClick(action)}>
            {action.name}
          </MenuItem>
        );
      });
  };

  return (
    <>
      <ActionButton
        icon={<MoreVertIcon />}
        type={ACTION_BUTTON_TYPES.icon}
        rest={{
          onClick: handleClick,
          "aria-label": "more",
          "aria-controls": "long-menu",
          "aria-haspopup": "true"
        }}
      />

      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {actionMenuItems()}
      </Menu>
    </>
  );
};

Container.defaultProps = {
  actionItems: []
};

Container.propTypes = {
  actionItems: PropTypes.array
};

Container.displayName = NAME;

export default Container;
