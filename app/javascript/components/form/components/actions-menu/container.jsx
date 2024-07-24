// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { NAME } from "./constants";

function Container({ actionItems = [] }) {
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
        id="form-record-actions"
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
}

Container.propTypes = {
  actionItems: PropTypes.array
};

Container.displayName = NAME;

export default Container;
