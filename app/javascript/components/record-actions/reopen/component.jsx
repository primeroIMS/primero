import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import { ActionDialog } from "components/action-dialog";
import { saveRecord } from "components/records";

const Reopen = ({ close, openReopenDialog, record, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch(
      saveRecord(
        recordType,
        "update",
        { data: { status: "open", case_reopened: true } },
        record.get("id"),
        i18n.t("cases.reopen_success"),
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
      dialogTitle={i18n.t("cases.reopen_dialog")}
      dialogText=""
      confirmButtonLabel={i18n.t("cases.ok")}
    />
  );
};

Reopen.propTypes = {
  close: PropTypes.func,
  openReopenDialog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string
};

export default Reopen;
