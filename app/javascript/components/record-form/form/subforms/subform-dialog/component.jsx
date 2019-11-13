import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import FormSectionField from "../../FormSectionField";
import { SUBFORM_DIALOG } from "../constants";

const Component = ({
  index,
  field,
  mode,
  open,
  setOpen,
  title,
  dialogIsNew,
  i18n
}) => {
  const handleClose = () => {
    setOpen({ open: false, index: null });
  };

  if (index !== null) {
    const actionButton = mode.isEdit ? (
      <Button
        onClick={handleClose}
        variant="contained"
        color="primary"
        elevation={0}
      >
        {i18n.t(dialogIsNew ? "buttons.add" : "buttons.update")}
      </Button>
    ) : null;

    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle disableTypography>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>{title}</Box>
            <Box>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {field.subform_section_id.fields.map(f => {
            const fieldProps = {
              name: `${field.name}[${index}].${f.name}`,
              field: f,
              mode,
              index,
              parentField: field
            };

            return (
              <Box my={3} key={f.name}>
                <FormSectionField {...fieldProps} />
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>{actionButton}</DialogActions>
      </Dialog>
    );
  }

  return null;
};

Component.displayName = SUBFORM_DIALOG;

Component.propTypes = {
  dialogIsNew: PropTypes.bool.isRequired,
  field: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  mode: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Component;
