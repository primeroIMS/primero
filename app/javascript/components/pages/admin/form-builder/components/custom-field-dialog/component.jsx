import React, { useState } from "react";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import ActionDialog from "../../../../../action-dialog";
import CustomFieldSelectorDialog from "../custom-field-selector-dialog";

const Component = () => {
  const [open, setOpen] = useState(false);

  const handleDialog = () => {
    setOpen(!open);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        disableElevation
        color="primary"
        onClick={handleDialog}
      >
        Add Field
      </Button>
      <ActionDialog open={open} maxSize="xs" disableActions>
        <CustomFieldSelectorDialog onOpen={handleDialog} />
        <Button
          fullWidth
          disableElevation
          onClick={handleDialog}
          variant="contained"
        >
          Cancel
        </Button>
      </ActionDialog>
    </>
  );
};

Component.displayName = "CustomFieldDialog";

Component.propTypes = {};

export default Component;
