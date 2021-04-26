import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { ACCEPTED, REJECTED, MODES } from "../../../../config";
import { FieldRecord, FormSectionRecord, whichFormMode, TEXT_FIELD } from "../../../form";
import FormSection from "../../../form/components/form-section";
import { submitHandler } from "../../../form/utils/form-submission";
import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import { DONE } from "../constants";

import { referralAccepted, referralDone, referralRejected } from "./action-creators";
import { NAME, FORM_ID, FORM_NOTE_FIELD_ID } from "./constants";

const Component = ({
  openReferralDialog,
  close,
  dialogName,
  pending,
  setPending,
  recordId,
  recordType,
  transistionId,
  referralType
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const initialValues = { note_on_referral_from_provider: "", rejected_reason: "" };
  const methods = useForm({ defaultValues: initialValues });
  const formMode = whichFormMode(MODES.edit);

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
            transistionId
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
            transistionId
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
            transistionId
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

  const renderNoteField = referralType === DONE && (
    <form id={FORM_NOTE_FIELD_ID}>
      <FormSection
        formMode={formMode}
        formMethods={methods}
        formSection={FormSectionRecord({
          unique_id: "referral_done",
          fields: [
            FieldRecord({
              display_name: i18n.t("referral.notes_on_referral"),
              name: "rejection_note",
              type: TEXT_FIELD,
              autoFocus: true
            })
          ]
        })}
        showTitle={false}
      />
    </form>
  );

  const renderRejectedReason = referralType === REJECTED && (
    <form id={FORM_ID}>
      <FormSection
        formSection={FormSectionRecord({
          unique_id: "rejected_form",
          fields: [
            FieldRecord({
              display_name: i18n.t("referral.rejected_reason"),
              name: "rejected_reason",
              type: TEXT_FIELD,
              autoFocus: true
            })
          ]
        })}
        showTitle={false}
        formMethods={methods}
        formMode={formMode}
      />
    </form>
  );

  const dialogContent = (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div onClick={stopProp}>
      <p>{i18n.t(`${recordType}.referral_${referralType}`)}</p>
      {renderNoteField}
      {renderRejectedReason}
    </div>
  );

  const confirmButtonLabel = referralType === DONE ? "buttons.done" : "buttons.ok";

  return (
    <ActionDialog
      open={openReferralDialog}
      cancelHandler={handleCancel}
      successHandler={methods.handleSubmit(handleSubmit)}
      dialogTitle={referralType === ACCEPTED ? i18n.t(`${recordType}.referral_accepted_header`) : ""}
      pending={pending}
      omitCloseAfterSuccess
      confirmButtonLabel={i18n.t(confirmButtonLabel)}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  openReferralDialog: false
};

Component.propTypes = {
  close: PropTypes.func,
  dialogName: PropTypes.string,
  openReferralDialog: PropTypes.bool,
  pending: PropTypes.bool,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  referralType: PropTypes.string,
  setPending: PropTypes.func,
  transistionId: PropTypes.string
};

export default Component;
