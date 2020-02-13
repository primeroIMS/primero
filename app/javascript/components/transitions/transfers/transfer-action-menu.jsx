import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useI18n } from "../../i18n";

import { ACCEPTED, REJECTED, REJECT } from "../../../config";
import { setDialog, setPending } from "../../record-actions/action-creators";
import { selectDialog, selectDialogPending } from "../../record-actions/selectors";

import { APPROVE, TRANSFER_APPROVAL_DIALOG } from "./constants";
import TransferApproval from "./transfer-approval";

const TransferActionMenu = ({ transition, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [transferMenu, setTransferMenu] = useState(null);
  const [approvalType, setApprovalType] = useState(ACCEPTED);
  const handleTransferMenuClose = () => {
    setTransferMenu(null);
  };
  const approvalOpen = useSelector(state =>
    selectDialog(TRANSFER_APPROVAL_DIALOG, state)
  );
  const setApprovalOpen = open => {
    dispatch(setDialog({ dialog: TRANSFER_APPROVAL_DIALOG, open: open }));
  };
  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending: pending }));
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
        pending={dialogPending}
        setPending={setDialogPending}
        transferId={transition.id}
        recordType={recordType}
        dialogName={TRANSFER_APPROVAL_DIALOG}
      />
    </>
  );
};

TransferActionMenu.propTypes = {
  recordType: PropTypes.string,
  transition: PropTypes.object
};

export default TransferActionMenu;
