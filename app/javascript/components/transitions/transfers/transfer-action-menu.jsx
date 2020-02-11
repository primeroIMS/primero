import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useI18n } from "../../i18n";

import { ACCEPTED, REJECTED, REJECT } from "../../../config";

import { APPROVE } from "./constants";
import TransferApproval from "./transfer-approval";

const TransferActionMenu = ({ transition, recordType }) => {
  const i18n = useI18n();
  const [transferMenu, setTransferMenu] = useState(null);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalType, setApprovalType] = useState(ACCEPTED);
  const handleTransferMenuClose = () => {
    setTransferMenu(null);
  };

  const handleAcceptOpen = event => {
    event.stopPropagation();
    handleTransferMenuClose();
    setApprovalType(ACCEPTED);
    setApprovalOpen(true);
  };

  const handleRejectOpen = event => {
    event.stopPropagation();
    handleTransferMenuClose();
    setApprovalType(REJECTED);
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
          key={APPROVE}
          selected={false}
          onClick={handleAcceptOpen}
          disabled={false}
        >
          {i18n.t("buttons.accept")}
        </MenuItem>
        <MenuItem
          key={REJECT}
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
        recordType={recordType}
      />
    </>
  );
};

TransferActionMenu.propTypes = {
  recordType: PropTypes.string,
  transition: PropTypes.object
};

export default TransferActionMenu;
