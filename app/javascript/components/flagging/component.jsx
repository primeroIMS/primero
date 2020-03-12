import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import FlagIcon from "@material-ui/icons/Flag";

import { useI18n } from "../i18n";

import { FlagForm, ListFlags, FlagDialog } from "./components";
import { fetchFlags } from "./action-creators";
import { selectFlags } from "./selectors";

const Flagging = ({ recordType, record, control }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(fetchFlags(recordType, record));
  }, [dispatch, recordType, record]);

  const flags = useSelector(state => selectFlags(state, record, recordType));

  const isBulkFlags = Array.isArray(record);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleActiveTab = value => {
    setTab(value);
  };

  const flagFormProps = {
    recordType,
    record,
    handleOpen,
    handleActiveTab
  };

  const flagDialogProps = {
    isBulkFlags,
    setOpen,
    open,
    tab,
    setTab
  };

  const listFlagsProps = {
    flags,
    recordType,
    record
  };

  return (
    <>
      {(control && <control onClick={handleOpen} />) || (
        <Button onClick={handleOpen} startIcon={<FlagIcon />} size="small">
          {i18n.t("buttons.flags")}
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
    </>
  );
};

Flagging.displayName = "Flagging";

Flagging.propTypes = {
  control: PropTypes.node,
  record: PropTypes.string,
  recordType: PropTypes.string.isRequired
};

export default Flagging;
