import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";
import { saveRecord } from "../../records";
import { ACTIONS } from "../../../libs/permissions";

import { NAME } from "./constants";

const ToggleOpen = ({ close, openReopenDialog, record, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const setValue =
    record && record.get("status") === "open" ? "close" : "reopen";
  const body =
    record && record.get("status") === "open"
      ? { data: { status: "closed" }, record_action: ACTIONS.CLOSE }
      : {
          data: { status: "open", case_status_reopened: true },
          record_action: ACTIONS.REOPEN
        };

  const handleOk = () => {
    dispatch(
      saveRecord(
        recordType,
        "update",
        body,
        record.get("id"),
        i18n.t(`cases.${setValue}_success`),
        false
      )
    );
    close();
  };

  return (
    <ActionDialog
      open={openReopenDialog}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle={i18n.t(`cases.${setValue}_dialog_title`)}
      dialogText={i18n.t(`cases.${setValue}_dialog`)}
      confirmButtonLabel={i18n.t("cases.ok")}
    />
  );
};

ToggleOpen.displayName = NAME;

ToggleOpen.propTypes = {
  close: PropTypes.func,
  openReopenDialog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string
};

export default ToggleOpen;
