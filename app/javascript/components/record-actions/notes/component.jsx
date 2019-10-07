import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import { ActionDialog } from "components/action-dialog";
import { TextField } from "@material-ui/core";

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
          label="Subject"
          type="text"
          fullWidth
        />
        <TextField label="Notes" multiline rows={2} rowsMax={4} fullWidth />
      </form>
    </ActionDialog>
  );
};

Notes.propTypes = {
  close: PropTypes.func,
  openNotesDialog: PropTypes.bool
};

export default Notes;
