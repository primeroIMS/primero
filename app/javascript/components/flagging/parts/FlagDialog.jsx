import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent } from "@material-ui/core";
import DialogTabs from "./DialogTabs";

const FlagDialog = ({ open, setOpen, children, isBulkFlags, tab, setTab }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const dialogProps = {
    onClose: handleClose,
    open,
    maxWidth: "sm",
    fullWidth: true,
    disableBackdropClick: true
  };

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogTabs
          closeDialog={handleClose}
          isBulkFlags={isBulkFlags}
          tab={tab}
          setTab={setTab}
        >
          {children}
        </DialogTabs>
      </DialogContent>
    </Dialog>
  );
};

FlagDialog.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  isBulkFlags: PropTypes.bool.isRequired,
  tab: PropTypes.number,
  setTab: PropTypes.func
};

export default FlagDialog;
