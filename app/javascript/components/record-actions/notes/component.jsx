import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";

const Notes = ({ close, openNotesDialog }) => {
  const i18n = useI18n();

  const handleOk = () => {
    close();
  };

  return (
    <ActionDialog
      open={openNotesDialog}
      successHandler={handleOk}
      dialogTitle={i18n.t("cases.notes_dialog_title")}
      confirmButtonLabel={i18n.t("buttons.save")}
      onClose={close}
    >
      <form>
        <TextField
          autoFocus
          margin="dense"
          id="subject"
          label={i18n.t("cases.notes_form_subject")}
          type="text"
          fullWidth
        />
        <TextField
          label={i18n.t("cases.notes_form_notes")}
          multiline
          rows={2}
          rowsMax={4}
          fullWidth
        />
      </form>
    </ActionDialog>
  );
};

Notes.propTypes = {
  close: PropTypes.func,
  openNotesDialog: PropTypes.bool
};

export default Notes;
