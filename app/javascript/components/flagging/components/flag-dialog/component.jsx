import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import DialogTabs from "../dialog-tabs";
import { FLAG_DIALOG } from "../../constants";
import { setDialog } from "../../../record-actions/action-creators";

import { NAME } from "./constants";

const Component = ({ openDialog, children, isBulkFlags, tab, setTab }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setDialog({ dialog: FLAG_DIALOG, open: false }));
  };

  const dialogProps = {
    onClose: handleClose,
    open: openDialog,
    maxSize: "md",
    disableBackdropClick: true,
    dialogTitle: i18n.t("flags.title"),
    disableActions: true
  };

  return (
    <ActionDialog {...dialogProps}>
      <DialogTabs isBulkFlags={isBulkFlags} tab={tab} setTab={setTab}>
        {children}
      </DialogTabs>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node.isRequired,
  handleOpen: PropTypes.func.isRequired,
  isBulkFlags: PropTypes.bool.isRequired,
  openDialog: PropTypes.bool.isRequired,
  setTab: PropTypes.func,
  tab: PropTypes.number
};

export default Component;
