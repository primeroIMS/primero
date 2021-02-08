import React, { useImperativeHandle, useRef } from "react";
import { useDispatch } from "react-redux";
import { FormContext, useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { MODES } from "../../../../config";
import { FieldRecord, FormSectionRecord, whichFormMode, TEXT_FIELD } from "../../../form";
import FormSection from "../../../form/components/form-section";
import { submitHandler } from "../../../form/utils/form-submission";
import bindFormSubmit from "../../../../libs/submit-form";
import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import { DONE } from "../constants";

import { referralDone } from "./action-creators";
import { NAME } from "./constants";

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
  const formRef = useRef();
  const initialValues = { note_on_referral_from_provider: "" };
  const methods = useForm({ defaultValues: initialValues });
  const formMode = whichFormMode(MODES.edit);

  const handleCancel = event => {
    if (event) {
      event.stopPropagation();
    }

    close();
  };

  const stopProp = event => {
    event.stopPropagation();
  };

  const message = referralType === DONE ? i18n.t(`${recordType}.referral_done_success`) : "";

  const handleOk = data => {
    setPending(true);

    dispatch(
      referralDone({
        data,
        dialogName,
        message,
        failureMessage: i18n.t(`${recordType}.request_approval_failure`),
        recordId,
        recordType,
        transistionId
      })
    );
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };

  const renderNoteField = (
    <FormContext {...methods} formMode={formMode}>
      <FormSection
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
    </FormContext>
  );

  const dialogContent =
    referralType === DONE ? (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <div onClick={stopProp}>
        <p>{i18n.t(`${recordType}.referral_done`)}</p>
        {renderNoteField}
      </div>
    ) : (
      ""
    );
  const confirmButtonLabel = referralType === DONE ? "buttons.done" : "buttons.ok";

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods: methods,
      formMode,
      i18n,
      initialValues,
      onSubmit: handleOk,
      submitAlways: true
    })
  );

  return (
    <ActionDialog
      open={openReferralDialog}
      successHandler={() => bindFormSubmit(formRef)}
      cancelHandler={handleCancel}
      dialogTitle=""
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
