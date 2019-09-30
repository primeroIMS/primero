import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import { ActionDialog } from "components/action-dialog";
import { saveRecord } from "components/records";

const CloseCase = ({ close, openCloseCaseDialog, record, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch(
      saveRecord(
        recordType,
        "update",
        { data: { status: "closed" } },
        record.get("id"),
        i18n.t("cases.close_success"),
        false
      )
    );
    close();
  };

  return (
    <ActionDialog
      open={openCloseCaseDialog}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle={i18n.t("cases.close_dialog")}
      dialogText=""
      confirmButtonLabel={i18n.t("cases.ok")}
    />
  );
};

CloseCase.propTypes = {
  close: PropTypes.func,
  openCloseCaseDialog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string
};

export default CloseCase;
