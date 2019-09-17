import React from "react";
import PropTypes from "prop-types";
import { Dialog } from "@material-ui/core";

function BasicDialog(props) {
  const { open, onClose, DialogContent } = props;
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogContent />
    </Dialog>
  );
}

BasicDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  DialogContent: PropTypes.func
};

export default BasicDialog;
