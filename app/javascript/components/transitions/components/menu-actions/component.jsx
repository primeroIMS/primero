// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import DisableOffline from "../../../disable-offline";
import { TRANSITION_STATUS, TRANSITIONS_TYPES } from "../../constants";
import { currentUser } from "../../../user/selectors";
import { usePermissions, ACTIONS } from "../../../permissions";
import { useI18n } from "../../../i18n";
import { ACCEPTED, REJECTED } from "../../../../config";
import RevokeModal from "../revoke-modal";
import TransferApproval from "../../transfers/transfer-approval";
import ReferralAction from "../../referrals/referral-action";
import { CREATE_CASE, DONE, REFERRAL_DONE_DIALOG } from "../../referrals/constants";
import { TRANSFER_APPROVAL_DIALOG } from "../../transfers/constants";
import { useDialog } from "../../../action-dialog";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMemoizedSelector } from "../../../../libs";
import { selectUserModules } from "../../../application";

import { NAME, REVOKE_MODAL } from "./constants";

function Component({ transition, showMode, recordType, classes }) {
  const i18n = useI18n();
  const {
    id,
    record_id: recordId,
    status,
    transitioned_to: transitionedTo,
    type,
    user_can_accept_or_reject: userCanAcceptOrReject,
    allow_case_creation: allowCaseCreation
  } = transition;

  const transitionType = type.toLowerCase();
  const [optionMenu, setOptionMenu] = useState(null);

  const revokeModalName = `${REVOKE_MODAL}-${id}`;
  const transferModalName = `${TRANSFER_APPROVAL_DIALOG}-${id}`;
  const referralModalName = `${REFERRAL_DONE_DIALOG}-${id}`;

  const { dialogClose, dialogOpen, pending, setDialog, setDialogPending } = useDialog([
    transferModalName,
    referralModalName,
    revokeModalName
  ]);

  const [transitionStatus, setTransitionStatus] = useState(ACCEPTED);
  const [caseCreationModule, setCaseCreationModule] = useState();

  const userModules = useMemoizedSelector(state => selectUserModules(state));

  const setRevokeDialog = open => setDialog({ dialog: revokeModalName, open });
  const setOpenTransitionDialog = open =>
    setDialog({ dialog: transitionType === TRANSITIONS_TYPES.referral ? referralModalName : transferModalName, open });

  const username = useMemoizedSelector(state => currentUser(state));

  const isInProgress = status === TRANSITION_STATUS.inProgress;
  const isAccepted = status === ACCEPTED;

  const { canReceiveReferral, canRevokeTransition, canCreateCaseFromReferral } = usePermissions(recordType, {
    canReceiveReferral: [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE],
    canRevokeTransition: [ACTIONS.REMOVE_ASSIGNED_USERS, ACTIONS.MANAGE],
    canCreateCaseFromReferral: [ACTIONS.CREATE_CASE_FROM_REFERRAL, ACTIONS.MANAGE]
  });
  const isCurrentUserRecipient = transitionedTo === username;

  const showRevokeAction = (isInProgress || isAccepted) && canRevokeTransition && !isCurrentUserRecipient && showMode;

  const showTransitionAction =
    isInProgress &&
    transition &&
    userCanAcceptOrReject &&
    showMode &&
    [TRANSITIONS_TYPES.transfer, TRANSITIONS_TYPES.referral].includes(transitionType);

  const showReferralDone =
    isAccepted && transition && isCurrentUserRecipient && showMode && transitionType === TRANSITIONS_TYPES.referral;

  const handleRejectOpen = () => {
    setTransitionStatus(REJECTED);
    setOpenTransitionDialog(true);
  };

  const handleAcceptOpen = () => {
    setTransitionStatus(ACCEPTED);
    setOpenTransitionDialog(true);
  };

  const handleDoneOpen = () => {
    setTransitionStatus(DONE);
    setOpenTransitionDialog(true);
  };

  const handleCreateCase = async (moduleID, moduleName) => {
    await setOpenTransitionDialog(true);
    await setCaseCreationModule([moduleID, moduleName]);
    setTransitionStatus(CREATE_CASE);
  };

  const options = [
    {
      name: i18n.t("actions.revoke"),
      condition: showRevokeAction,
      action: () => setRevokeDialog(true)
    },
    {
      name: i18n.t("buttons.accept"),
      condition:
        (transitionType === TRANSITIONS_TYPES.referral && canReceiveReferral && showTransitionAction) ||
        (showTransitionAction && transitionType !== TRANSITIONS_TYPES.referral),
      action: event => handleAcceptOpen(event)
    },
    {
      name: i18n.t("buttons.reject"),
      condition:
        (transitionType === TRANSITIONS_TYPES.referral && canReceiveReferral && showTransitionAction) ||
        (showTransitionAction && transitionType !== TRANSITIONS_TYPES.referral),
      action: event => handleRejectOpen(event)
    },
    {
      name: i18n.t("buttons.done"),
      condition: showReferralDone,
      action: event => handleDoneOpen(event)
    },
    ...userModules.map(module => ({
      name: i18n.t("buttons.referral_create_case", { module_id: module.name }),
      condition:
        transitionType === TRANSITIONS_TYPES.referral && canCreateCaseFromReferral && isAccepted && allowCaseCreation,
      action: () => handleCreateCase(module.unique_id, module.name)
    }))
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
      <MenuItem
        data-testid="menu-item"
        key={option.name}
        selected={option === "Pyxis"}
        onClick={event => handleAction(event, option.action)}
      >
        {option.name}
      </MenuItem>
    );
  });

  if (!actions?.length) {
    return null;
  }

  return (
    <div className={classes.iconBar}>
      <DisableOffline>
        <ActionButton
          id="more-actions"
          icon={<MoreVertIcon />}
          type={ACTION_BUTTON_TYPES.icon}
          rest={{
            "aria-label": "more",
            "aria-controls": "long-menu",
            "aria-haspopup": "true",
            onClick: handleClick
          }}
        />
      </DisableOffline>
      <Menu
        keepMounted
        id="long-menu"
        anchorEl={optionMenu}
        open={Boolean(optionMenu)}
        onClose={event => handleClose(event)}
      >
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
      {transitionType === TRANSITIONS_TYPES.transfer && (
        <TransferApproval
          openTransferDialog={dialogOpen[transferModalName]}
          close={dialogClose}
          approvalType={transitionStatus}
          recordId={recordId}
          pending={pending}
          setPending={setDialogPending}
          transferId={id}
          recordType={recordType}
          dialogName={transferModalName}
        />
      )}
      {transitionType === TRANSITIONS_TYPES.referral && (
        <ReferralAction
          openReferralDialog={dialogOpen[referralModalName]}
          close={dialogClose}
          recordId={recordId}
          pending={pending}
          setPending={setDialogPending}
          transistionId={id}
          recordType={recordType}
          dialogName={referralModalName}
          referralType={transitionStatus}
          caseCreationModule={caseCreationModule}
        />
      )}
    </div>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  classes: PropTypes.object,
  recordType: PropTypes.string,
  showMode: PropTypes.bool,
  transition: PropTypes.object.isRequired
};

export default Component;
