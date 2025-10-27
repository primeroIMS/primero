// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import Form, { FORM_MODE_DIALOG } from "../../form";
import { saveRecord } from "../../records";
import { ACTIONS } from "../../permissions";

import useFormAttribute from "./use-form-attribute";

const FORM_ID = "form_attribute";

function ActionAttribute({ close, open, record, recordType, pending, setPending }) {
  const dispatch = useDispatch();
  const i18n = useI18n();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [submitData, setSubmitData] = useState({});
  const { formSections, validationSchema } = useFormAttribute();

  const succesConfirmationModal = () => {
    setOpenConfirmationModal(false);
    setPending(true);
    dispatch(
      saveRecord(
        recordType,
        "update",
        { data: { ...submitData }, record_action: ACTIONS.ATTRIBUTE },
        record.get("id"),
        i18n.t(`cases.attribute.success`),
        i18n.t("offline_submitted_changes"),
        false,
        false
      )
    );
    close();
  };

  const cancelConfirmationModal = () => setOpenConfirmationModal(false);

  const handleSubmit = data => {
    setSubmitData(data);
    setOpenConfirmationModal(true);
  };

  return (
    <>
      <ActionDialog
        open={open}
        onClose={close}
        pending={pending}
        omitCloseAfterSuccess
        dialogSubHeader={i18n.t("cases.attribute.text")}
        dialogTitle={i18n.t("cases.attribute.title")}
        confirmButtonLabel={i18n.t("buttons.save")}
        confirmButtonProps={{
          form: FORM_ID,
          type: "submit"
        }}
      >
        <Form
          mode={FORM_MODE_DIALOG}
          formSections={formSections}
          onSubmit={handleSubmit}
          validations={validationSchema}
          formID={FORM_ID}
          showTitle={false}
        />
      </ActionDialog>
      <ActionDialog
        open={openConfirmationModal}
        successHandler={succesConfirmationModal}
        cancelHandler={cancelConfirmationModal}
        dialogTitle={i18n.t("cases.attribute.confirm_title")}
        dialogText={i18n.t("cases.attribute.confirm_text")}
        confirmButtonLabel={i18n.t("buttons.ok")}
      />
    </>
  );
}

ActionAttribute.displayName = "ActionAttribute";

ActionAttribute.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string,
  setPending: PropTypes.func
};

export default ActionAttribute;
