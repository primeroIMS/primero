// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useRef } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import css from "./styles.css";

const ActionMenu = ({ open, onOpen, onClose, items }) => {
  const moreButtonRef = useRef(null);

  return (
    <>
      <IconButton
        aria-label="More"
        aria-controls="long-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={onOpen}
        ref={moreButtonRef}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={moreButtonRef.current}
        open={open}
        onClose={onClose}
        keepMounted
        PaperProps={{
          style: css.paper
        }}
        classes={{ root: css.root }}
      >
        {items.map(item => {
          return (
            <MenuItem key={item.get("id")} onClick={item.get("onClick")}>
              {item.get("label")}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

ActionMenu.displayName = "ActionMenu";

ActionMenu.propTypes = {
  items: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default ActionMenu;
