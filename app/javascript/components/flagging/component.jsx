import React, { useState, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import FlagIcon from "@material-ui/icons/Flag";
import { withRouter } from "react-router-dom";
import { FlagForm, ListFlags, FlagDialog } from "./parts";
import { fetchFlags } from "./action-creators";
import { selectFlags } from "./selectors";

const Flagging = ({ recordType, records, control, match }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const { url } = match;

  useEffect(() => {
    dispatch(fetchFlags(url));
  }, [dispatch, url]);

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

  return (
    <>
      {(control && <control onClick={handleOpen} />) || (
        <IconButton onClick={handleOpen}>
          <FlagIcon />
        </IconButton>
      )}
      <FlagDialog {...flagDialogProps}>
        <div hidetab={isBulkFlags.toString()}>
          <ListFlags flags={flags} />
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
  control: PropTypes.node,
  match: PropTypes.object
};

export default withRouter(Flagging);
