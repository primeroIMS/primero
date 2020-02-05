import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useI18n } from "../../i18n";

import TransferApproval from "./transfer-approval";

const TransferActionMenu = ({ transition }) => {
  const i18n = useI18n();
  const [transferMenu, setTransferMenu] = useState(null);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalType, setApprovalType] = useState("accepted");
  const handleTransferMenuClose = () => {
    setTransferMenu(null);
  };

  const handleAcceptOpen = event => {
    event.stopPropagation();
    handleTransferMenuClose();
    setApprovalType("accepted");
    setApprovalOpen(true);
  };

  const handleRejectOpen = event => {
    event.stopPropagation();
    handleTransferMenuClose();
    setApprovalType("rejected");
    setApprovalOpen(true);
  };

  const handleTransferMenuClick = event => {
    event.stopPropagation();
    setTransferMenu(event.currentTarget);
  };

  const handleClose = () => {
    setApprovalOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleTransferMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={transferMenu}
        keepMounted
        open={Boolean(transferMenu)}
        onClose={handleTransferMenuClose}
      >
        <MenuItem
          key="approve"
          selected={false}
          onClick={handleAcceptOpen}
          disabled={false}
        >
          {i18n.t("buttons.accept")}
        </MenuItem>
        <MenuItem
          key="reject"
          selected={false}
          onClick={handleRejectOpen}
          disabled={false}
        >
          {i18n.t("buttons.reject")}
        </MenuItem>
      </Menu>

      <TransferApproval
        openTransferDialog={approvalOpen}
        close={handleClose}
        approvalType={approvalType}
        recordId={transition.record_id}
        transferId={transition.id}
      />
    </>
  );
};

TransferActionMenu.propTypes = {
  transition: PropTypes.object
};

export default TransferActionMenu;
