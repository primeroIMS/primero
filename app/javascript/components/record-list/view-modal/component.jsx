import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";

import { TransferRequest } from "./transfer-request";
import { NAME } from "./constants";

const ViewModal = ({ close, openViewModal, currentRecord }) => {
  const i18n = useI18n();
  const [sendRequest, setSendRequest] = useState(false);

  const handleOk = () => {
    setSendRequest(true);
    close();
  };

  const caseId = `ID #${currentRecord && currentRecord.get("case_id_display")}`;

  const confirmButtonProps = {
    color: "primary",
    variant: "outlined",
    autoFocus: true
  };

  const sendRequestProps = {
    open: sendRequest,
    setOpen: setSendRequest,
    currentRecord,
    caseId
  };

  return (
    <>
      <ActionDialog
        open={openViewModal}
        successHandler={handleOk}
        dialogTitle={caseId}
        confirmButtonLabel={i18n.t("buttons.request_transfer")}
        confirmButtonProps={confirmButtonProps}
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
      <TransferRequest {...sendRequestProps} />
    </>
  );
};

ViewModal.displayName = NAME;

ViewModal.propTypes = {
  close: PropTypes.func,
  currentRecord: PropTypes.object,
  openViewModal: PropTypes.bool
};

export default ViewModal;
