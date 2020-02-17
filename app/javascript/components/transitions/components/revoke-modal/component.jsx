import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { ActionDialog } from "../../../action-dialog";
import { useI18n } from "../../../i18n";

import { revokeTransition } from "./action-creators";
import { NAME } from "./constants";

const Component = ({ open, close, transition, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const transitionType = transition.type.toLowerCase();

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };

  const handleCancel = event => {
    if (event) {
      event.stopPropagation();
    }

    close();
  };

  const handleOk = () => {
    const message = i18n.t("cases.revoke_success_message", {
      case_id: transition.record_id,
      transition_type: i18n.t(`transition.type.${transitionType}`),
      recipient_username: transition.transitioned_to
    });

    dispatch(
      revokeTransition({
        message,
        recordType,
        recordId: transition.record_id,
        transitionType,
        transitionId: transition.id
      })
    );

    close();
  };

  return (
    <ActionDialog
      open={open}
      successHandler={handleOk}
      cancelHandler={handleCancel}
      dialogTitle=""
      confirmButtonLabel={i18n.t("actions.revoke")}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {i18n.t("cases.revoke_message", {
        transition_type: i18n.t(`transition.type.${transitionType}`)
      })}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  recordType: PropTypes.string,
  transition: PropTypes.object.isRequired
};

export default Component;
