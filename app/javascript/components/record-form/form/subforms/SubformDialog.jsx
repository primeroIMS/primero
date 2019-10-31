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
import FormSectionField from "../FormSectionField";

const SubformDialog = ({ index, field, mode, open, setOpen, title, dialogIsNew, i18n }) => {
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
        {dialogIsNew ? i18n.t("buttons.add") : i18n.t("buttons.update")}
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
        <DialogActions>
          {actionButton}
        </DialogActions>
      </Dialog>
    );
  }

  return null;
};

SubformDialog.propTypes = {
  index: PropTypes.number.isRequired,
  field: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  dialogIsNew: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired
};

export default SubformDialog;
