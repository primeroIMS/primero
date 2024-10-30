// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useMemo } from "react";
import PropTypes from "prop-types";
import { List } from "immutable";
import { batch, useDispatch } from "react-redux";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import Form, { FORM_MODE_DIALOG } from "../../form";
import { getRecordAlerts, saveRecord } from "../../records";
import { ACTIONS } from "../../permissions";
import { fetchAlerts } from "../../nav/action-creators";
import { NOTES_DIALOG } from "../constants";
import { useMemoizedSelector } from "../../../libs";

import { NAME, FORM_ID } from "./constants";
import useNotesForm from "./use-notes-form";

function Component({ close, open, pending, record, recordType, setPending, primeroModule }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const recordAlerts = useMemoizedSelector(state => getRecordAlerts(state, recordType));
  const { validationSchema, formSection } = useNotesForm({ recordType, primeroModule });
  const formSections = useMemo(() => (formSection ? List([formSection]) : List([])), [formSection]);

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
        showTitle={false}
      />
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool.isRequired,
  primeroModule: PropTypes.string.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  setPending: PropTypes.func.isRequired
};

export default Component;
