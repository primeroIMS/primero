import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";

import ActionDialog from "../../../../../action-dialog";
import CustomFieldSelectorDialog from "../custom-field-selector-dialog";
import { useI18n } from "../../../../../i18n";
import { FormAction } from "../../../../../form";

import styles from "./styles.css";
import { NAME } from "./constants";

const Component = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [open, setOpen] = useState(false);

  const handleDialog = () => {
    setOpen(!open);
  };

  return (
    <>
      <FormAction
        actionHandler={handleDialog}
        text={i18n.t("fields.add_field")}
        startIcon={<AddIcon />}
      />
      <ActionDialog
        open={open}
        maxSize="xs"
        disableActions
        dialogTitle={i18n.t("fields.add_field")}
      >
        <div>
          <Button
            disabled
            fullWidth
            disableElevation
            variant="contained"
            className={css.existingFieldButton}
          >
            <SearchIcon />
            {i18n.t("fields.add_existing_field")}
          </Button>
          <CustomFieldSelectorDialog onOpen={handleDialog} />
          <Button
            fullWidth
            disableElevation
            onClick={handleDialog}
            variant="contained"
            className={css.cancelButton}
          >
            <CloseIcon />
            {i18n.t("buttons.cancel")}
          </Button>
        </div>
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {};

export default Component;
