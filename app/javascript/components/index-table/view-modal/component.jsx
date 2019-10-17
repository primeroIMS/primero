import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import { ActionDialog } from "components/action-dialog";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const ViewModal = ({ close, openViewModal, currentRecord }) => {
  const i18n = useI18n();

  const handleOk = () => {
    close();
  };
  console.log(
    "currentRecord",
    currentRecord && currentRecord.toJS(),
    typeof currentRecord,
    currentRecord && currentRecord.get("case_id_display")
  );
  return (
    <ActionDialog
      open={openViewModal}
      successHandler={handleOk}
      dialogTitle={`ID #${currentRecord &&
        currentRecord.get("case_id_display")}`}
      confirmButtonLabel={i18n.t("buttons.save")}
      onClose={close}
    >
      <form>
        <TextField
          autoFocus
          margin="dense"
          id="subject"
          label={i18n.t("cases.full_name")}
          type="text"
          defaultValue={currentRecord && currentRecord.get("name")}
          disabled
          fullWidth
        />
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              autoFocus
              margin="dense"
              id="subject"
              label={i18n.t("cases.sex")}
              type="text"
              defaultValue={currentRecord && currentRecord.get("sex")}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              autoFocus
              margin="dense"
              id="subject"
              label={i18n.t("cases.date_of_birth")}
              type="text"
              defaultValue={currentRecord && currentRecord.get("date_of_birth")}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              autoFocus
              margin="dense"
              id="subject"
              label={i18n.t("cases.age")}
              type="text"
              defaultValue={currentRecord && currentRecord.get("age")}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              autoFocus
              margin="dense"
              id="subject"
              label={i18n.t("cases.age_estimated")}
              type="text"
              defaultValue={
                currentRecord && currentRecord.get("estimated")
                  ? "True"
                  : "False"
              }
              disabled
            />
          </Grid>
        </Grid>
      </form>
    </ActionDialog>
  );
};

ViewModal.propTypes = {
  close: PropTypes.func,
  openViewModal: PropTypes.bool,
  currentRecord: PropTypes.object
};

export default ViewModal;
