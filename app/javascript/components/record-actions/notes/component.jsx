// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useMemo } from "react";
import PropTypes from "prop-types";
import { List } from "immutable";
import { batch, useDispatch } from "react-redux";
import { object } from "yup";

import { useApp } from "../../application";
import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import Form, { FORM_MODE_DIALOG } from "../../form";
import { getRecordAlerts, saveRecord } from "../../records";
import { ACTIONS } from "../../permissions";
import { fetchAlerts } from "../../nav/action-creators";
import { NOTES_DIALOG } from "../constants";
import { useMemoizedSelector } from "../../../libs";
import { getSubFormForFieldName } from "../../record-form/selectors";
import { RECORD_TYPES } from "../../../config";
import { fieldValidations } from "../../record-form/form/validations";
import displayConditionsEnabled from "../../record-form/form/utils/display-conditions-enabled";
import getDisplayConditions from "../../record-form/form/utils/get-display-conditions";
import { parseExpression } from "../../../libs/expressions";

import { NAME, FORM_ID } from "./constants";

const HIDDEN_FIELD_NAMES = ["note_date", "note_created_by"];

function Component({ close, open, pending, record, recordType, setPending, primeroModule }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();

  const notesSubform = useMemoizedSelector(state =>
    getSubFormForFieldName(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule,
      fieldName: "notes_section",
      checkVisible: false
    })
  );

  const recordAlerts = useMemoizedSelector(state => getRecordAlerts(state, recordType));

  const formSection = useMemo(() => {
    const fields = notesSubform?.fields?.map(field => {
      if (HIDDEN_FIELD_NAMES.includes(field.name)) {
        return field.merge({ visible: false });
      }

      if (displayConditionsEnabled(field.display_conditions_subform)) {
        return field.merge({
          watchedInputs: notesSubform.fields
            .filter(subformField => !HIDDEN_FIELD_NAMES.includes(subformField.name))
            .map(watchedField => watchedField.name),
          showIf: values => parseExpression(getDisplayConditions(field.display_conditions_subform)).evaluate(values)
        });
      }

      return field;
    });

    return notesSubform?.set("fields", fields);
  }, [notesSubform]);

  const formSections = useMemo(() => (formSection ? List([formSection]) : List([])), [formSection]);

  const validationSchema = useMemo(
    () =>
      object().shape(
        formSection?.fields
          ?.filter(field => !field.disabled)
          ?.reduce((acc, field) => ({ ...acc, ...fieldValidations(field, { i18n, online }) }), {})
      ),
    [formSection]
  );

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
