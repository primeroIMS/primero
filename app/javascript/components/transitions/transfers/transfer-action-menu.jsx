import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useI18n } from "../../i18n";

const TransferActionMenu = ({ transition }) => {
  const i18n = useI18n();
  const [transferMenu, setTransferMenu] = useState(null);
  const [acceptOpen, setAcceptOpen] = useState(true);
  const [rejectOpen, setRejectOpen] = useState(true);

  const handleTransferMenuClose = () => {
    setTransferMenu(null);
  };

  const handleAcceptOpen = () => {
    setAcceptOpen(true);
  };

  const handleRejectOpen = () => {
    setRejectOpen(true);
  };

  const handleTransferMenuClick = event => {
    setTransferMenu(event.currentTarget);
  };

  // const handleItemAction = itemAction => {
  //   handleClose();
  //   itemAction();
  // };

  const actionItems = (
    <>
      <MenuItem
        key="approve"
        selected={action.name === "Pyxis"}
        onClick={handleAcceptOpen}
        disabled={disabled}
      >
        {"Approve"}
      </MenuItem>
      <MenuItem
        key="reject"
        selected={action.name === "Pyxis"}
        onClick={handleRejectOpen}
        disabled={disabled}
      >
        {"Reject"}
      </MenuItem>
    </>
  );

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleTransferMenuClick}
      >
        <MoreVertIcon color={iconColor} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={transferMenu}
        keepMounted
        open={Boolean(transferMenu)}
        onClose={handleTransferMenuClose}
      >
        {actionItems}
      </Menu>
    </>
  );
};

TransferActionMenu.propTypes = {
  transition: PropTypes.object
};

export default TransferActionMenu;
