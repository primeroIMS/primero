import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import { ActionDialog } from "components/action-dialog";
import { setReopen } from "./action-creators";

function Reopen(props) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { close, openReopenDialog, record, recordType } = props;

  const handleOk = () => {
    dispatch(
      setReopen(
        record.get("id"),
        { data: { status: "open", case_reopened: true } },
        i18n.t("cases.reopen_success"),
        recordType
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
}

Reopen.propTypes = {
  close: PropTypes.func,
  openReopenDialog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string
};

export default Reopen;
