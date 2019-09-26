import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import { ActionDialog } from "components/action-dialog";
import { setClose } from "./action-creators";

function CloseCase(props) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { close, openCloseCaseDialog, record, recordType } = props;

  const handleOk = () => {
    dispatch(
      setClose(
        record.get("id"),
        { data: { status: "closed" } },
        i18n.t("cases.close_success"),
        recordType
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
}

CloseCase.propTypes = {
  close: PropTypes.func,
  openCloseCaseDialog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string
};

export default CloseCase;
