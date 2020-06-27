import React from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import DialogTabs from "../dialog-tabs";

import { NAME } from "./constants";

const Component = ({ open, setOpen, children, isBulkFlags, tab, setTab }) => {
  const i18n = useI18n();
  const handleClose = () => {
    setOpen(false);
  };

  const dialogProps = {
    onClose: handleClose,
    open,
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
  isBulkFlags: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  setTab: PropTypes.func,
  tab: PropTypes.number
};

export default Component;
