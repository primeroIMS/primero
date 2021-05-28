import { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import DisableOffline from "../../../disable-offline";
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
import { useMemoizedSelector } from "../../../../libs";

import { NAME, REVOKE_MODAL } from "./constants";

const Component = ({ transition, showMode, recordType, classes }) => {
  const i18n = useI18n();
  const { id, record_id: recordId, status, transitioned_to: transitionedTo, type } = transition;
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

  const setRevokeDialog = open => setDialog({ dialog: revokeModalName, open });
  const setOpenTransitionDialog = open =>
    setDialog({ dialog: transitionType === TRANSITIONS_TYPES.referral ? referralModalName : transferModalName, open });

  const username = useMemoizedSelector(state => currentUser(state));
  const userPermissions = useMemoizedSelector(state => getPermissionsByRecord(state, recordType));

  const isInProgress = status === TRANSITION_STATUS.inProgress;
  const isAccepted = status === ACCEPTED;
  const canReceiveReferral = checkPermissions(userPermissions, [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]);
  const canRevokeTransition = checkPermissions(userPermissions, [ACTIONS.REMOVE_ASSIGNED_USERS, ACTIONS.MANAGE]);
  const isCurrentUserRecipient = transitionedTo === username;

  const showRevokeAction = (isInProgress || isAccepted) && canRevokeTransition && !isCurrentUserRecipient && showMode;

  const showTransitionAction =
    isInProgress &&
    transition &&
    isCurrentUserRecipient &&
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
      <DisableOffline>
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
      </DisableOffline>
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
        />
      )}
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
