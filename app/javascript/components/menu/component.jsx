import { useState } from "react";
import PropTypes from "prop-types";
import { Menu } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import ActionButton, { ACTION_BUTTON_TYPES } from "../action-button";

import { MenuItems } from "./components";

const Component = ({ actions, disabledCondition, showMenu }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {showMenu && (
        <ActionButton
          icon={<MoreVertIcon />}
          type={ACTION_BUTTON_TYPES.icon}
          rest={{
            "aria-label": "more",
            "aria-controls": "long-menu",
            "aria-haspopup": "true",
            onClick: handleClick
          }}
        />
      )}
      <Menu
        id="long-menu"
        variant="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <MenuItems actions={actions} disabledCondition={disabledCondition} handleClose={handleClose} />
      </Menu>
    </>
  );
};

Component.defaultProps = {
  actions: [],
  disabledCondition: () => {},
  showMenu: false
};

Component.displayName = "Menu";

Component.propTypes = {
  actions: PropTypes.array,
  disabledCondition: PropTypes.func,
  showMenu: PropTypes.bool
};

export default Component;
