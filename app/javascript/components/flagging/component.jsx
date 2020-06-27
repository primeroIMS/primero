import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import FlagIcon from "@material-ui/icons/Flag";

import { useI18n } from "../i18n";
import ButtonText from "../button-text";

import { FlagForm, ListFlags, FlagDialog } from "./components";
import { fetchFlags } from "./action-creators";
import { NAME } from "./constants";

const Component = ({ control, record, recordType, showActionButtonCss }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(fetchFlags(recordType, record));
  }, [dispatch, recordType, record]);

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
    recordType,
    record
  };

  return (
    <>
      {(control && <control onClick={handleOpen} />) || (
        <Button
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
