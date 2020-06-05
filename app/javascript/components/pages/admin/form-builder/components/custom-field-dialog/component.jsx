import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import { useSelector, useDispatch, batch } from "react-redux";

import ActionDialog from "../../../../../action-dialog";
import CustomFieldSelectorDialog from "../custom-field-selector-dialog";
import { useI18n } from "../../../../../i18n";
import { FormAction } from "../../../../../form";
import { selectDialog } from "../../../../../record-actions/selectors";
import { setDialog } from "../../../../../record-actions/action-creators";
import { CUSTOM_FIELD_SELECTOR_DIALOG } from "../custom-field-selector-dialog/constants";

import styles from "./styles.css";
import { NAME, CUSTOM_FIELD_DIALOG } from "./constants";

const Component = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const openFieldDialog = useSelector(state =>
    selectDialog(CUSTOM_FIELD_DIALOG, state)
  );

  const handleDialog = () => {
    dispatch(setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: true }));
  };

  const handleCustomFieldSelectorDialog = () => {
    batch(() => {
      dispatch(setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: false }));
      dispatch(setDialog({ dialog: CUSTOM_FIELD_SELECTOR_DIALOG, open: true }));
    });
  };

  const handleClose = () => {
    dispatch(setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: false }));
  };

  return (
    <>
      <FormAction
        actionHandler={handleDialog}
        text={i18n.t("fields.add_field")}
        startIcon={<AddIcon />}
      />
      <ActionDialog
        open={openFieldDialog}
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
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disableElevation
            onClick={handleCustomFieldSelectorDialog}
            className={css.existingFieldButton}
          >
            <FormatListBulletedIcon />
            <span>{i18n.t("fields.add_custom_field")}</span>
          </Button>
          <Button
            fullWidth
            disableElevation
            onClick={handleClose}
            variant="contained"
            className={css.cancelButton}
          >
            <CloseIcon />
            {i18n.t("buttons.cancel")}
          </Button>
        </div>
      </ActionDialog>
      <CustomFieldSelectorDialog />
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {};

export default Component;
