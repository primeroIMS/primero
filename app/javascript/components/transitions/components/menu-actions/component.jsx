import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { TRANSITION_STATUS, TRANSITIONS_TYPES } from "../../constants";
import { getPermissionsByRecord, currentUser } from "../../../user/selectors";
import { ACTIONS, checkPermissions } from "../../../../libs/permissions";
import { useI18n } from "../../../i18n";
import { ACCEPTED, REJECTED } from "../../../../config";
import RevokeModal from "../revoke-modal";
import TransferApproval from "../../transfers/transfer-approval";

import { NAME } from "./constants";

const Component = ({ transition, showMode, recordType, classes }) => {
  const i18n = useI18n();
  const [optionMenu, setOptionMenu] = useState(null);
  const [openRevokeDialog, setRevokeDialog] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalType, setApprovalType] = useState(ACCEPTED);
  const open = Boolean(optionMenu);
  const username = useSelector(state => currentUser(state));
  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );
  const isInProgress = transition.status === TRANSITION_STATUS.inProgress;
  const canRevokeTransition = checkPermissions(userPermissions, [
    ACTIONS.REMOVE_ASSIGNED_USERS,
    ACTIONS.MANAGE
  ]);
  const isCurrentUserRecipient = transition.transitioned_to === username;

  const showRevokeAction =
    isInProgress && canRevokeTransition && !isCurrentUserRecipient && showMode;
  const showTransferApproval =
    isInProgress &&
    transition &&
    isCurrentUserRecipient &&
    showMode &&
    transition.type.toLowerCase() === TRANSITIONS_TYPES.transfer;

  const handleCloseApproval = () => setApprovalOpen(false);

  const handleRejectOpen = () => {
    setApprovalType(REJECTED);
    setApprovalOpen(true);
  };

  const handleAcceptOpen = () => {
    setApprovalType(ACCEPTED);
    setApprovalOpen(true);
  };

  const options = [
    {
      name: i18n.t("actions.revoke"),
      condition: showRevokeAction,
      action: () => setRevokeDialog(true)
    },
    {
      name: i18n.t("buttons.accept"),
      condition: showTransferApproval,
      action: event => handleAcceptOpen(event)
    },
    {
      name: i18n.t("buttons.reject"),
      condition: showTransferApproval,
      action: event => handleRejectOpen(event)
    }
  ];

  const handleClick = event => {
    event.stopPropagation();
    setOptionMenu(event.currentTarget);
  };

  const handleClose = event => {
    if (event) {
      event.stopPropagation();
    }
    setOptionMenu(null);
  };

  const handleAction = (event, itemAction) => {
    event.stopPropagation();
    itemAction();
    handleClose();
  };

  const actions = options
    .filter(option => option.condition)
    .map(option => {
      return (
        <MenuItem
          key={option.name}
          selected={option === "Pyxis"}
          onClick={event => handleAction(event, option.action)}
        >
          {option.name}
        </MenuItem>
      );
    });

  const menu = actions?.length ? (
    <div className={classes.iconBar}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={optionMenu}
        open={open}
        onClose={event => handleClose(event)}
      >
        {actions}
      </Menu>

      <RevokeModal
        open={openRevokeDialog}
        transition={transition}
        close={() => setRevokeDialog(false)}
        recordType={recordType}
      />
      <TransferApproval
        openTransferDialog={approvalOpen}
        close={handleCloseApproval}
        approvalType={approvalType}
        recordId={transition.record_id}
        transferId={transition.id}
        recordType={recordType}
      />
    </div>
  ) : null;

  return <>{menu}</>;
};

Component.displayName = NAME;

Component.propTypes = {
  classes: PropTypes.object,
  recordType: PropTypes.string,
  showMode: PropTypes.bool,
  transition: PropTypes.object.isRequired
};

export default Component;
