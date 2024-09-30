// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../config";
import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import { usePermissions, ACTIONS } from "../../permissions";
import { reduceMapToObject, useMemoizedSelector } from "../../../libs";
import { getMiniFormFields } from "../../record-form";
import Form, { AUDIO_RECORD_FIELD, FORM_MODE_SHOW, PHOTO_RECORD_FIELD } from "../../form";
import { getCommonMiniFormFields } from "../../record-form/selectors";

import viewModalForm from "./form";
import TransferRequest from "./transfer-request";
import { COMMON_FIELD_NAMES, FORM_ID, NAME } from "./constants";

function ViewModal({ close, openViewModal, currentRecord, recordType }) {
  const i18n = useI18n();
  const [sendRequest, setSendRequest] = useState(false);

  const commonFieldNames = Object.values(COMMON_FIELD_NAMES);
  const miniFormFields = useMemoizedSelector(state =>
    getMiniFormFields(state, RECORD_TYPES[recordType], currentRecord?.get("module_id"), commonFieldNames)
  );
  const commonMiniFormFields = useMemoizedSelector(state =>
    getCommonMiniFormFields(state, RECORD_TYPES[recordType], currentRecord?.get("module_id"), commonFieldNames)
  );

  const canRequestTransfer = usePermissions(recordType, [ACTIONS.MANAGE, ACTIONS.REQUEST_TRANSFER]);

  const form = viewModalForm(i18n, commonMiniFormFields, miniFormFields);

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
