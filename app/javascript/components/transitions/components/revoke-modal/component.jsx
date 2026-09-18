import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { push } from "connected-react-router";

import ActionDialog from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import { selectTransitionByTypeAndStatus } from "../../selectors";
import { TRANSITIONS_TYPES, TRANSITION_STATUS } from "../../constants";
import { MODES, RECORD_PATH, REVOKED } from "../../../../config";
import { selectModule, useApp } from "../../../application";
import { useMemoizedSelector } from "../../../../libs";
import { getSelectedRecordData } from "../../../records";
import { submitHandler } from "../../../form";
import ReferralDoneForm from "../../referrals/referral-action/referral-done-form";
import useReferralForm from "../../referrals/use-referral-form";

import { revokeTransition } from "./action-creators";
import { NAME } from "./constants";

function Component({ name, close, open, pending, recordType, setPending, transition, serviceRecordId }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const transitionType = transition.type.toLowerCase();
  const localizedTransitionType = i18n.t(`transition.type.${transitionType}`);
  const { currentUserName } = useApp();
  const inProgressTransitions = useMemoizedSelector(state =>
    selectTransitionByTypeAndStatus(
      state,
      [upperFirst(TRANSITIONS_TYPES.referral), upperFirst(TRANSITIONS_TYPES.transfer)],
      TRANSITION_STATUS.inProgress
    )
  );
  const record = useMemoizedSelector(state => getSelectedRecordData(state, recordType));
  const recordModule = useMemoizedSelector(state => selectModule(state, record.get("module_id"), false));
  const { methods, formMode } = useReferralForm({
    defaultValues: {},
    mode: MODES.edit,
    status: REVOKED,
    serviceRecordId
  });

  const {
    formState: { dirtyFields }
  } = methods;

  const handleCancel = event => {
    if (event) {
      event.stopPropagation();
    }

    close();
  };

  const handleOk = data => {
    const message = i18n.t("cases.revoke_success_message", {
      case_id: transition.record_id,
      transition_type: i18n.t(`transition.type.${transitionType}`),
      recipient_username: transition.transitioned_to
    });

    setPending(true);

    dispatch(
      revokeTransition({
        data,
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

    if (inProgressTransitions.size === 1 && currentUserName === transition.transitioned_to) {
      dispatch(push(`/${RECORD_PATH.cases}`));
    }
  };

  const handleSubmit = data => {
    submitHandler({
      data,
      dispatch,
      dirtyFields,
      formMode,
      i18n,
      initialValues: {},
      onSubmit: handleOk,
      submitAlways: true
    });
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
      successHandler={methods.handleSubmit(handleSubmit)}
    >
      <p>{i18n.t("cases.revoke_message", { transition_type: localizedTransitionType })}</p>
      {transitionType === TRANSITIONS_TYPES.referral && (
        <ReferralDoneForm
          formMode={formMode}
          formMethods={methods}
          recordType={recordType}
          recordModule={recordModule}
          serviceRecordId={serviceRecordId}
        />
      )}
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  name: PropTypes.string,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  recordType: PropTypes.string,
  serviceRecordId: PropTypes.string,
  setPending: PropTypes.func,
  transition: PropTypes.object.isRequired
};

export default Component;
