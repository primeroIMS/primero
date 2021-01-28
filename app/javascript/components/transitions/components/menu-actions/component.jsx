import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { TRANSITION_STATUS, TRANSITIONS_TYPES } from "../../constants";
import { getPermissionsByRecord, currentUser } from "../../../user/selectors";
import { ACTIONS, checkPermissions } from "../../../../libs/permissions";
import { useI18n } from "../../../i18n";
import { ACCEPTED, REJECTED } from "../../../../config";
import RevokeModal from "../revoke-modal";
import TransferApproval from "../../transfers/transfer-approval";
import ReferralAction from "../../referrals/referral-action";
import { DONE, REFERRAL_DONE_DIALOG } from "../../referrals/constants";
import { TRANSFER_APPROVAL_DIALOG } from "../../transfers/constants";
import { useDialog } from "../../../action-dialog";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { NAME, REVOKE_MODAL } from "./constants";

const Component = ({ transition, showMode, recordType, classes }) => {
  const i18n = useI18n();
  const [optionMenu, setOptionMenu] = useState(null);

  const revokeModalName = `${REVOKE_MODAL}-${transition.id}`;

  const { dialogClose, dialogOpen, pending, setDialog, setDialogPending } = useDialog([
    TRANSFER_APPROVAL_DIALOG,
    REFERRAL_DONE_DIALOG,
    revokeModalName
  ]);

  const [approvalType, setApprovalType] = useState(ACCEPTED);
  const [referralType, setReferralType] = useState(DONE);

  const setRevokeDialog = open => {
    setDialog({ dialog: revokeModalName, open });
  };

  const setApprovalOpen = open => {
    setDialog({ dialog: TRANSFER_APPROVAL_DIALOG, open });
  };

  const setReferralOpen = open => {
    setDialog({ dialog: REFERRAL_DONE_DIALOG, open });
  };

  const username = useSelector(state => currentUser(state));
  const userPermissions = useSelector(state => getPermissionsByRecord(state, recordType));

  const isInProgress = transition.status === TRANSITION_STATUS.inProgress;
  const canRevokeTransition = checkPermissions(userPermissions, [ACTIONS.REMOVE_ASSIGNED_USERS, ACTIONS.MANAGE]);
  const isCurrentUserRecipient = transition.transitioned_to === username;

  const showRevokeAction = isInProgress && canRevokeTransition && !isCurrentUserRecipient && showMode;

  const showTransferApproval =
    isInProgress &&
    transition &&
    isCurrentUserRecipient &&
    showMode &&
    transition.type.toLowerCase() === TRANSITIONS_TYPES.transfer;

  const showReferralMenu =
    isInProgress &&
    transition &&
    isCurrentUserRecipient &&
    showMode &&
    transition.type.toLowerCase() === TRANSITIONS_TYPES.referral;

  const handleRejectOpen = () => {
    setApprovalType(REJECTED);
    setApprovalOpen(true);
  };

  const handleAcceptOpen = () => {
    setApprovalType(ACCEPTED);
    setApprovalOpen(true);
  };

  const handleDoneOpen = () => {
    setReferralType(DONE);
    setReferralOpen(true);
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
    },
    {
      name: i18n.t("buttons.done"),
      condition: showReferralMenu,
      action: event => handleDoneOpen(event)
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

  const filteredActions = options.filter(option => option.condition);
  const actions = filteredActions.map(option => {
    return (
      <MenuItem key={option.name} selected={option === "Pyxis"} onClick={event => handleAction(event, option.action)}>
        {option.name}
      </MenuItem>
    );
  });

  if (!actions?.length) {
    return null;
  }

  return (
    <div className={classes.iconBar}>
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
      <Menu id="long-menu" anchorEl={optionMenu} open={Boolean(optionMenu)} onClose={event => handleClose(event)}>
        {actions}
      </Menu>

      <RevokeModal
        name={revokeModalName}
        open={dialogOpen[revokeModalName]}
        transition={transition}
        close={dialogClose}
        recordType={recordType}
        pending={pending}
        setPending={setDialogPending}
      />
      <TransferApproval
        openTransferDialog={dialogOpen[TRANSFER_APPROVAL_DIALOG]}
        close={dialogClose}
        approvalType={approvalType}
        recordId={transition.record_id}
        pending={pending}
        setPending={setDialogPending}
        transferId={transition.id}
        recordType={recordType}
        dialogName={TRANSFER_APPROVAL_DIALOG}
      />
      <ReferralAction
        openReferralDialog={dialogOpen[REFERRAL_DONE_DIALOG]}
        close={dialogClose}
        recordId={transition.record_id}
        pending={pending}
        setPending={setDialogPending}
        transistionId={transition.id}
        recordType={recordType}
        dialogName={REFERRAL_DONE_DIALOG}
        referralType={referralType}
      />
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  classes: PropTypes.object,
  recordType: PropTypes.string,
  showMode: PropTypes.bool,
  transition: PropTypes.object.isRequired
};

export default Component;
