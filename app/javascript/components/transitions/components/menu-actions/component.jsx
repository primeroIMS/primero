import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
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
import {
  selectDialog,
  selectDialogPending
} from "../../../record-actions/selectors";
import { setDialog, setPending } from "../../../record-actions/action-creators";

import { NAME, REVOKE_MODAL, TRANSFER_MODAL } from "./constants";

const Component = ({ transition, showMode, recordType, classes }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [optionMenu, setOptionMenu] = useState(null);
  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };
  const isReferral = transition.type === TRANSITIONS_TYPES.referral;
  const revokeModalName = `${isReferral ? REVOKE_MODAL : TRANSFER_MODAL}-${
    transition.id
  }`;
  const openRevokeDialog = useSelector(state =>
    selectDialog(revokeModalName, state)
  );
  const setRevokeDialog = open => {
    dispatch(setDialog({ dialog: revokeModalName, open }));
  };
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalType, setApprovalType] = useState(ACCEPTED);
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
        open={Boolean(optionMenu)}
        onClose={event => handleClose(event)}
      >
        {actions}
      </Menu>

      <RevokeModal
        name={revokeModalName}
        open={openRevokeDialog}
        transition={transition}
        close={() => setRevokeDialog(false)}
        recordType={recordType}
        pending={dialogPending}
        setPending={setDialogPending}
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
