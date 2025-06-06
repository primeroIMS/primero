// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import { usePermissions, ACTIONS } from "../../permissions";
import { reduceMapToObject } from "../../../libs";
import Form, { AUDIO_RECORD_FIELD, FORM_MODE_SHOW, PHOTO_RECORD_FIELD } from "../../form";

import TransferRequest from "./transfer-request";
import { FORM_ID, NAME } from "./constants";
import useViewModalForms from "./use-view-modal-forms";

function ViewModal({ close, openViewModal, currentRecord, recordType }) {
  const i18n = useI18n();
  const [sendRequest, setSendRequest] = useState(false);

  const canRequestTransfer = usePermissions(recordType, [ACTIONS.MANAGE, ACTIONS.REQUEST_TRANSFER]);

  const { miniFormFields, forms: form } = useViewModalForms({
    record: currentRecord,
    recordType
  });

  const handleOk = () => {
    setSendRequest(true);
    close();
  };

  const caseId = `ID #${currentRecord && currentRecord.get("case_id_display")}`;

  const confirmButtonProps = {
    color: "primary",
    variant: "outlined",
    autoFocus: true
  };

  const sendRequestProps = {
    open: sendRequest,
    setOpen: setSendRequest,
    currentRecord,
    caseId
  };

  const recordObject = reduceMapToObject(currentRecord || fromJS({}));
  const initialValues = miniFormFields.reduce((acc, field) => {
    if ([AUDIO_RECORD_FIELD, PHOTO_RECORD_FIELD].includes(field.get("type"))) {
      return { ...acc, [field.name]: acc?.[field.name] || [] };
    }

    return acc;
  }, recordObject);

  const onSubmit = () => {};

  return (
    <>
      <ActionDialog
        open={openViewModal}
        successHandler={handleOk}
        dialogTitle={caseId}
        confirmButtonLabel={i18n.t("buttons.request_transfer")}
        confirmButtonProps={confirmButtonProps}
        onClose={close}
        showSuccessButton={canRequestTransfer}
      >
        <Form
          formID={FORM_ID}
          onSubmit={onSubmit}
          useCancelPrompt
          mode={FORM_MODE_SHOW}
          formSections={form}
          initialValues={initialValues}
        />
      </ActionDialog>
      <TransferRequest {...sendRequestProps} />
    </>
  );
}

ViewModal.displayName = NAME;

ViewModal.propTypes = {
  close: PropTypes.func,
  currentRecord: PropTypes.object,
  openViewModal: PropTypes.bool,
  recordType: PropTypes.string.isRequired
};

export default ViewModal;
