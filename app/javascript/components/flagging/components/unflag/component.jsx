import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import PropTypes from "prop-types";
import { object, string } from "yup";
import { List } from "immutable";

import { useI18n } from "../../../i18n";
import { unFlag } from "../../action-creators";
import ActionDialog from "../../../action-dialog";
import {
  selectDialog,
  selectDialogPending
} from "../../../record-actions/selectors";
import { setDialog, setPending } from "../../../record-actions/action-creators";
import { FLAG_DIALOG } from "../../constants";
import Form, {
  FieldRecord,
  FormSectionRecord,
  FORM_MODE_DIALOG
} from "../../../form";

import { NAME, UNFLAG_DIALOG } from "./constants";

const validationSchema = object().shape({
  unflag_message: string().required()
});

const Component = ({ flag }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formRef = useRef();

  const openUnflagDialog = useSelector(state =>
    selectDialog(state, UNFLAG_DIALOG)
  );

  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };

  useEffect(() => {
    if (openUnflagDialog) {
      setDialogPending(false);
      dispatch(setDialog({ dialog: FLAG_DIALOG, open: false }));
    }
  }, [openUnflagDialog]);

  if (!flag) {
    return null;
  }

  const handleReset = () => {
    dispatch(setDialog({ dialog: UNFLAG_DIALOG, open: false }));
    setDialogPending(false);
    dispatch(setDialog({ dialog: FLAG_DIALOG, open: true }));
  };

  const handleSubmit = data => {
    batch(() => {
      setDialogPending(true);
      dispatch(
        unFlag(
          flag.id,
          { data },
          i18n.t("flags.flag_resolved"),
          flag.record_type,
          flag.record_id
        )
      );
      dispatch(setDialog({ dialog: UNFLAG_DIALOG, open: false }));
      dispatch(setDialog({ dialog: FLAG_DIALOG, open: true }));
    });
  };

  const bindFormSubmit = () => {
    formRef.current.submitForm();
  };

  const formSections = List([
    FormSectionRecord({
      unique_id: "resolve_flag",
      fields: List([
        FieldRecord({
          display_name: i18n.t("flags.resolve_reason"),
          name: "unflag_message",
          type: "text_field",
          required: true,
          autoFocus: true
        })
      ])
    })
  ]);

  return (
    <ActionDialog
      open={openUnflagDialog}
      maxSize="sm"
      dialogTitle={i18n.t("flags.resolve_flag")}
      confirmButtonLabel={i18n.t("flags.resolve_button")}
      successHandler={bindFormSubmit}
      cancelHandler={handleReset}
      pending={dialogPending}
      omitCloseAfterSuccess
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
  flag: PropTypes.object.isRequired
};

export default Component;
