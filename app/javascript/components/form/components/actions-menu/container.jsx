import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

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

  const actionMenuItems = actionItems
    .filter(
      action => typeof action.condition === "undefined" || action.condition
    )
    .map(action => (
      <MenuItem
        key={action.name}
        selected={action.name === "Pyxis"}
        onClick={() => handleItemAction(action.action)}
      >
        {action.name}
      </MenuItem>
    ));

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="primary"
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {actionMenuItems}
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
