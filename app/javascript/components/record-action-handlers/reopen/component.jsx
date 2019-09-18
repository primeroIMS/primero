import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import { BasicDialog } from "../../basic-dialog";
import { setReopen } from "./action-creators";
import styles from "./styles.css";

function Reopen(props) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { close, openReopenDialog, record, recordType } = props;
  const css = makeStyles(styles)();

  const ReopenDialogContent = () => {
    const handleOk = () => {
      console.log("okay now send patch");
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
      <div className={css.dialogButtonContainer}>
        <DialogTitle id="simple-dialog-title">
          {i18n.t("cases.reopen_dialog")}
        </DialogTitle>
        <Button
          color="primary"
          variant="contained"
          className={css.dialogButton}
          onClick={handleOk}
        >
          OK
        </Button>
        <Button
          variant="contained"
          className={css.dialogButton}
          onClick={close}
        >
          Cancel
        </Button>
      </div>
    );
  };

  return (
    <BasicDialog
      open={openReopenDialog}
      onClose={close}
      DialogContent={ReopenDialogContent}
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
