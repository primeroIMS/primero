import React from "react";
import PropTypes from "prop-types";
import { TextField, Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";

const ViewModal = ({ close, openViewModal, currentRecord }) => {
  const i18n = useI18n();

  const handleOk = () => {
    close();
  };

  return (
    <ActionDialog
      open={openViewModal}
      successHandler={handleOk}
      dialogTitle={`ID #${currentRecord &&
        currentRecord.get("case_id_display")}`}
      confirmButtonLabel={i18n.t("buttons.request_transfer")}
      onClose={close}
    >
      <form>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              id="subject"
              label={i18n.t("cases.case_worker_code")}
              type="text"
              defaultValue={currentRecord && currentRecord.get("owned_by")}
              disabled
              fullWidth
              InputProps={{
                disableUnderline: true
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              id="subject"
              label={i18n.t("cases.agency")}
              type="text"
              defaultValue="--"
              disabled
              InputProps={{
                disableUnderline: true
              }}
            />
          </Grid>
        </Grid>
        <Divider />
        <TextField
          autoFocus
          margin="dense"
          id="subject"
          label={i18n.t("cases.full_name")}
          type="text"
          defaultValue={currentRecord && currentRecord.get("name")}
          disabled
          fullWidth
          InputProps={{
            disableUnderline: true
          }}
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
              InputProps={{
                disableUnderline: true
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              autoFocus
              margin="dense"
              id="subject"
              label={i18n.t("cases.date_of_birth")}
              type="text"
              defaultValue={
                (currentRecord && currentRecord.get("date_of_birth")) || "--"
              }
              disabled
              InputProps={{
                disableUnderline: true
              }}
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
              InputProps={{
                disableUnderline: true
              }}
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
                (currentRecord && currentRecord.get("estimated")) || "--"
              }
              disabled
              InputProps={{
                disableUnderline: true
              }}
            />
          </Grid>
        </Grid>
      </form>
    </ActionDialog>
  );
};

ViewModal.propTypes = {
  close: PropTypes.func,
  currentRecord: PropTypes.object,
  openViewModal: PropTypes.bool
};

export default ViewModal;
