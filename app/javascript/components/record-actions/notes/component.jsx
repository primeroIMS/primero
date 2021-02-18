import PropTypes from "prop-types";
import { List } from "immutable";
import { batch, useDispatch } from "react-redux";
import { object, string } from "yup";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import Form, { FieldRecord, FormSectionRecord, FORM_MODE_DIALOG } from "../../form";
import { getRecordAlerts, saveRecord } from "../../records";
import { ACTIONS } from "../../../libs/permissions";
import { fetchAlerts } from "../../nav/action-creators";
import { NOTES_DIALOG } from "../constants";
import { useMemoizedSelector } from "../../../libs";

import { NAME, FORM_ID } from "./constants";

const validationSchema = object().shape({
  note_subject: string().required(),
  note_text: string().required()
});

const Component = ({ close, open, pending, record, recordType, setPending }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const recordAlerts = useMemoizedSelector(state => getRecordAlerts(state, recordType));

  const handleSubmit = data => {
    setPending(true);

    batch(async () => {
      await dispatch(
        saveRecord(
          recordType,
          "update",
          { data: { notes_section: [data] }, record_action: ACTIONS.ADD_NOTE },
          record.get("id"),
          i18n.t(`notes.note_success`),
          i18n.t("offline_submitted_changes"),
          false,
          false,
          NOTES_DIALOG
        )
      );
    });

    if (recordAlerts.size <= 0) {
      dispatch(fetchAlerts());
    }
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
      open={open}
      dialogTitle={i18n.t("cases.notes_dialog_title")}
      confirmButtonLabel={i18n.t("buttons.save")}
      omitCloseAfterSuccess
      onClose={close}
      pending={pending}
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
      />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  setPending: PropTypes.func.isRequired
};

export default Component;
