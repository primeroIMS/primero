import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { push } from "connected-react-router";

import ActionDialog from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import { selectTransitionByTypeAndStatus } from "../../selectors";
import { TRANSITIONS_TYPES, TRANSITION_STATUS } from "../../constants";
import { RECORD_PATH } from "../../../../config";

import { revokeTransition } from "./action-creators";
import { NAME } from "./constants";

const Component = ({
  name,
  close,
  open,
  pending,
  recordType,
  setPending,
  transition
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const transitionType = transition.type.toLowerCase();
  const localizedTransitionType = i18n.t(`transition.type.${transitionType}`);

  const inProgressTransitions = useSelector(state =>
    selectTransitionByTypeAndStatus(
      state,
      [
        upperFirst(TRANSITIONS_TYPES.referral),
        upperFirst(TRANSITIONS_TYPES.transfer)
      ],
      TRANSITION_STATUS.inProgress
    )
  );

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

    setPending(true);

    dispatch(
      revokeTransition({
        message,
        recordType,
        recordId: transition.record_id,
        transitionType,
        transitionId: transition.id,
        dialogName: name,
        failureMessage: i18n.t(`${recordType}.revoke_failure`, {
          transition_type: localizedTransitionType
        })
      })
    );

    if (inProgressTransitions.size === 1) {
      dispatch(push(`/${RECORD_PATH.cases}`));
    }
  };

  return (
    <ActionDialog
      cancelHandler={handleCancel}
      confirmButtonLabel={i18n.t("actions.revoke")}
      dialogTitle=""
      maxSize="xs"
      omitCloseAfterSuccess
      open={open}
      pending={pending}
      successHandler={handleOk}
    >
      {i18n.t("cases.revoke_message", {
        transition_type: localizedTransitionType
      })}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  name: PropTypes.string,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  recordType: PropTypes.string,
  setPending: PropTypes.func,
  transition: PropTypes.object.isRequired
};

export default Component;
