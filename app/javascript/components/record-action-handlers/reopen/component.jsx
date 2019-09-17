import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import { BasicDialog } from "../../basic-dialog";
import { setReopen } from "./action-creators";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

function Reopen(props) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { close, openReopenDialog, record, recordType } = props;
  const classes = useStyles();

  const ReopenDialogContent = () => {
    const handleOk = () => {
      console.log("okay now send patch");
      dispatch(
        setReopen(
          record.get("id"),
          { data: { child_status: "open", case_reopened: true } },
          i18n.t("cases.reopen_success"),
          recordType
        )
      );
      close();
    };

    return (
      <div>
        <DialogTitle id="simple-dialog-title">
          {i18n.t("cases.reopen_dialog")}
        </DialogTitle>
        <Button
          variant="contained"
          className={classes.button}
          onClick={handleOk}
        >
          OK
        </Button>
        <Button variant="contained" className={classes.button} onClick={close}>
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
