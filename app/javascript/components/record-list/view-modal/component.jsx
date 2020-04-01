import React, { useState } from "react";
import PropTypes from "prop-types";
import { Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import DisplayData from "../../display-data/component";

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
              <DisplayData
                label={i18n.t("cases.case_worker_code")}
                value={currentRecord && currentRecord.get("owned_by")}
              />
            </Grid>
            <Grid item xs={6}>
              <DisplayData label={i18n.t("cases.agency")} />
            </Grid>
          </Grid>
          <Divider />
          <DisplayData
            label={i18n.t("cases.full_name")}
            value={currentRecord && currentRecord.get("name")}
          />
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <DisplayData
                label={i18n.t("cases.sex")}
                value={currentRecord && currentRecord.get("sex")}
              />
            </Grid>
            <Grid item xs={3}>
              <DisplayData
                label={i18n.t("cases.date_of_birth")}
                value={currentRecord && currentRecord.get("date_of_birth")}
              />
            </Grid>
            <Grid item xs={3}>
              <DisplayData
                label={i18n.t("cases.age")}
                value={currentRecord && currentRecord.get("age")}
              />
            </Grid>
            <Grid item xs={3}>
              <DisplayData
                label={i18n.t("cases.age_estimated")}
                value={currentRecord && currentRecord.get("estimated")}
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
