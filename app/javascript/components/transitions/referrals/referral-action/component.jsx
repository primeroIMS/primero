import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { ACCEPTED, REJECTED, MODES, RECORD_TYPES_PLURAL } from "../../../../config";
import { submitHandler } from "../../../form/utils/form-submission";
import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import { CREATE_CASE, DONE } from "../constants";
import { useMemoizedSelector } from "../../../../libs";
import { getSelectedRecordData } from "../../../records";
import { selectModule } from "../../../application";
import {
  mapRecordForCaseCreation,
  referralConfirmButtonKey,
  referralHeaderKey,
  referralMessageKey
} from "../utils";
import useReferralForm from "../use-referral-form";

import { NAME, FORM_ID } from "./constants";
import { referralAccepted, referralCaseCreation, referralDone, referralRejected } from "./action-creators";
import ReferralDoneForm from "./referral-done-form";
import RejectedReferralForm from "./referral-rejected-form";

function Component({
  openReferralDialog = false,
  close,
  dialogName,
  pending,
  setPending,
  recordId,
  recordType,
  transitionId,
  referralType,
  caseCreationModule,
  serviceRecordId,
  remote = false
}) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const moduleID = caseCreationModule?.[1];
  const record = useMemoizedSelector(state => getSelectedRecordData(state, RECORD_TYPES_PLURAL.case));
  const recordModule = useMemoizedSelector(state => selectModule(state, moduleID, false));

  const initialValues = { note_on_referral_from_provider: "", rejected_reason: "" };

  const { methods, formMode } = useReferralForm({
    defaultValues: initialValues,
    mode: MODES.edit,
    status: referralType,
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

  const stopProp = event => {
    event.stopPropagation();
  };

  const handleOk = data => {
    setPending(true);

    switch (referralType) {
      case DONE:
        dispatch(
          referralDone({
            data,
            dialogName,
            message: i18n.t(`${recordType}.referral_done_success`),
            failureMessage: i18n.t(`${recordType}.request_approval_failure`),
            recordId,
            recordType,
            transitionId
          })
        );
        break;
      case ACCEPTED:
        dispatch(
          referralAccepted({
            message: i18n.t(`${recordType}.referral_accepted_success`),
            failureMessage: i18n.t(`${recordType}.request_approval_failure`),
            recordId,
            recordType,
            transitionId
          })
        );
        break;
      case REJECTED:
        dispatch(
          referralRejected({
            data,
            message: i18n.t(`${recordType}.referral_rejected_success`),
            failureMessage: i18n.t(`${recordType}.request_approval_failure`),
            recordId,
            recordType,
            transitionId
          })
        );
        break;
      case CREATE_CASE:
        dispatch(
          referralCaseCreation({
            ...mapRecordForCaseCreation(
              record,
              recordModule?.creation_field_map?.find(fieldMap => fieldMap.map_to === caseCreationModule?.[0])
            ),
            source_case_display_id: record.get("case_id"),
            module_id: caseCreationModule?.[0]
          })
        );
        break;
      default:
        break;
    }
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true,
    options: {
      form: FORM_ID,
      type: "submit"
    }
  };

  const handleSubmit = data => {
    submitHandler({
      data,
      dispatch,
      dirtyFields,
      formMode,
      i18n,
      initialValues,
      onSubmit: handleOk,
      submitAlways: true
    });
  };

  const messageKey = referralMessageKey({ recordType, remote, status: referralType });
  const dialogContent = (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div onClick={stopProp}>
      <p>{i18n.t(messageKey)}</p>
      {referralType === DONE && (
        <ReferralDoneForm
          formMode={formMode}
          formMethods={methods}
          recordType={recordType}
          recordModule={recordModule}
          serviceRecordId={serviceRecordId}
        />
      )}
      {referralType === REJECTED && <RejectedReferralForm formMode={formMode} formMethods={methods} />}
    </div>
  );

  const confirmButtonKey = referralConfirmButtonKey({ remote, status: referralType });
  const headerKey = referralHeaderKey({ recordType, remote, status: referralType });
  const dialogTitle = headerKey ? i18n.t(headerKey, moduleID ? { module_id: moduleID } : {}) : "";

  return (
    <ActionDialog
      open={openReferralDialog}
      cancelHandler={handleCancel}
      successHandler={methods.handleSubmit(handleSubmit)}
      dialogTitle={dialogTitle}
      pending={pending}
      omitCloseAfterSuccess
      confirmButtonLabel={i18n.t(confirmButtonKey)}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {dialogContent}
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  caseCreationModule: PropTypes.string,
  close: PropTypes.func,
  dialogName: PropTypes.string,
  openReferralDialog: PropTypes.bool,
  pending: PropTypes.bool,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  referralType: PropTypes.string,
  remote: PropTypes.bool,
  serviceRecordId: PropTypes.string,
  setPending: PropTypes.func,
  transitionId: PropTypes.string
};

export default Component;
