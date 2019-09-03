import React, { useState, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import FlagIcon from "@material-ui/icons/Flag";
import { FlagForm, ListFlags, FlagDialog } from "./parts";
import { fetchFlags } from "./action-creators";
import { selectFlags } from "./selectors";

const Flagging = ({ recordType, records, control }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFlags(recordType, records));
  }, [dispatch, recordType, records]);

  const flags = useSelector(state => selectFlags(state, records, recordType));

  const isBulkFlags = Array.isArray(records);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleActiveTab = value => {
    setTab(value);
  };

  const flagFormProps = {
    recordType,
    records,
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
    records
  };

  return (
    <>
      {(control && <control onClick={handleOpen} />) || (
        <IconButton onClick={handleOpen}>
          <FlagIcon />
        </IconButton>
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

Flagging.propTypes = {
  recordType: PropTypes.string.isRequired,
  records: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  control: PropTypes.node
};

export default Flagging;
