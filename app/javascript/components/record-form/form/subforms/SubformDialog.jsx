/* eslint-disable */
import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import FormSectionField from "../FormSectionField";

const SubformDialog = ({ index, field, mode, open, setOpen }) => {
  const handleAdd = () => {
    setOpen({ open: false, index: null });
  };

  // TODO: Revert changes
  const handleCancel = () => {
    setOpen({ open: false, index: null });
  }

  if (index !== null) {
    return (
      <Dialog open={open}>
        <DialogTitle>Title</DialogTitle>
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
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
};

export default SubformDialog;
