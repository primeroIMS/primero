import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import FlagIcon from "@material-ui/icons/Flag";

import { useI18n } from "../i18n";
import ButtonText from "../button-text";
import { setDialog } from "../record-actions/action-creators";
import { selectDialog } from "../record-actions/selectors";

import { FlagForm, ListFlags, FlagDialog, Unflag } from "./components";
import { fetchFlags } from "./action-creators";
import { NAME, FLAG_DIALOG } from "./constants";
import { getSelectedFlag } from "./selectors";

const Component = ({ control, record, recordType, showActionButtonCss }) => {
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(fetchFlags(recordType, record));
  }, [dispatch, recordType, record]);

  const isBulkFlags = Array.isArray(record);

  const openDialog = useSelector(state => selectDialog(state, FLAG_DIALOG));
  const selectedFlag = useSelector(state => getSelectedFlag(state));

  const handleOpen = () => {
    dispatch(setDialog({ dialog: FLAG_DIALOG, open: true }));
  };

  const handleActiveTab = value => {
    setTab(value);
  };

  const flagFormProps = {
    recordType,
    record,
    handleActiveTab
  };

  const flagDialogProps = {
    isBulkFlags,
    openDialog,
    tab,
    setTab
  };

  const listFlagsProps = {
    recordType,
    record
  };

  return (
    <>
      {(control && <control onClick={handleOpen} />) || (
        <Button
          aria-label={i18n.t("buttons.flags")}
          onClick={handleOpen}
          size="small"
          className={showActionButtonCss}
        >
          <FlagIcon />
          <ButtonText text={i18n.t("buttons.flags")} />
        </Button>
      )}
      <FlagDialog {...flagDialogProps}>
        <div hidetab={isBulkFlags.toString()}>
          <ListFlags {...listFlagsProps} />
        </div>
        <div>
          <FlagForm {...flagFormProps} />
        </div>
      </FlagDialog>
      <Unflag flag={selectedFlag} />
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  control: PropTypes.node,
  record: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  showActionButtonCss: PropTypes.string
};

export default Component;
