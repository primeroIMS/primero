import React, { useRef } from "react";
import PropTypes from "prop-types";
import { List } from "immutable";
import { useDispatch, useSelector } from "react-redux";
import { object, string } from "yup";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import Form, {
  FieldRecord,
  FormSectionRecord,
  FORM_MODE_DIALOG
} from "../../form";
import { getRecordAlerts, saveRecord } from "../../records";
import { ACTIONS } from "../../../libs/permissions";
import { fetchRecordsAlerts } from "../../records/action-creators";
import { fetchAlerts } from "../../nav/action-creators";

import { NAME } from "./constants";

const validationSchema = object().shape({
  note_subject: string().required(),
  note_text: string().required()
});

const Component = ({ close, openNotesDialog, record, recordType }) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const recordAlerts = useSelector(state => getRecordAlerts(state, recordType));

  const handleSubmit = async data => {
    await dispatch(
      saveRecord(
        recordType,
        "update",
        { data: { notes_section: [data] }, record_action: ACTIONS.ADD_NOTE },
        record.get("id"),
        i18n.t(`notes.note_success`),
        false,
        false,
        false
      )
    );

    dispatch(fetchRecordsAlerts(recordType, record.get("id")));
    if (recordAlerts.size <= 0) {
      dispatch(fetchAlerts());
    }

    close();
  };

  const bindFormSubmit = () => {
    formRef.current.submitForm();
  };

  const formSections = List([
    FormSectionRecord({
      unique_id: "notes_section",
      fields: List([
        FieldRecord({
          display_name: i18n.t("cases.notes_form_subject"),
          name: "note_subject",
          type: "text_field",
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("cases.notes_form_notes"),
          name: "note_text",
          type: "textarea",
          required: true
        })
      ])
    })
  ]);

  return (
    <ActionDialog
      open={openNotesDialog}
      successHandler={bindFormSubmit}
      dialogTitle={i18n.t("cases.notes_dialog_title")}
      confirmButtonLabel={i18n.t("buttons.save")}
      onClose={close}
    >
      <Form
        mode={FORM_MODE_DIALOG}
        formSections={formSections}
        onSubmit={handleSubmit}
        ref={formRef}
        validations={validationSchema}
      />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  openNotesDialog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
