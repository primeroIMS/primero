import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import { useSelector, useDispatch, batch } from "react-redux";

import ActionDialog from "../../../../../action-dialog";
import CustomFieldSelectorDialog from "../custom-field-selector-dialog";
import { useI18n } from "../../../../../i18n";
import { selectDialog } from "../../../../../record-actions/selectors";
import { setDialog } from "../../../../../record-actions/action-creators";
import { CUSTOM_FIELD_SELECTOR_DIALOG } from "../custom-field-selector-dialog/constants";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";
import { NAME as EXISTING_FIELD_DIALOG_NAME } from "../existing-field-dialog/constants";
import { compare } from "../../../../../../libs";
import { getSelectedField, getSelectedSubform } from "../../selectors";
import { isSubformField, setInitialForms, setSubformData, toggleHideOnViewPage } from "../field-dialog/utils";
import { mergeOnSelectedSubform } from "../../action-creators";

import styles from "./styles.css";
import { NAME, CUSTOM_FIELD_DIALOG } from "./constants";

const Component = ({ getValues }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const selectedField = useSelector(state => getSelectedField(state), compare);
  const openFieldDialog = useSelector(state => selectDialog(state, CUSTOM_FIELD_DIALOG));

  const isSubform = isSubformField(selectedField);
  const selectedSubform = useSelector(state => getSelectedSubform(state), compare);
  const isSelectedSubform = selectedSubform.toSeq().size > 0 && isSubform;

  const handleDialog = () => {
    if (isSubform) {
      dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: false }));

      if (getValues) {
        const selectedFieldName = selectedField?.get("name");
        const data = getValues({ nest: true });
        const subformData = setInitialForms(data.subform_section);
        const fieldData = setSubformData(toggleHideOnViewPage(data[selectedFieldName]), subformData);

        dispatch(mergeOnSelectedSubform({ subform: subformData, subformField: fieldData }));
      }
    }
    dispatch(setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: true }));
  };

  const handleExistingFieldDialog = () => {
    batch(() => {
      dispatch(setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: false }));
      dispatch(setDialog({ dialog: EXISTING_FIELD_DIALOG_NAME, open: true }));
    });
  };

  const handleCustomFieldSelectorDialog = () => {
    batch(() => {
      dispatch(setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: false }));
      dispatch(setDialog({ dialog: CUSTOM_FIELD_SELECTOR_DIALOG, open: true }));
    });
  };

  const handleClose = () => {
    if (isSubform && selectedSubform.toSeq().size) {
      dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: true }));
    }
    dispatch(setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: false }));
  };

  return (
    <>
      <ActionButton
        icon={<AddIcon />}
        text={i18n.t("fields.add_field")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleDialog
        }}
      />
      <ActionDialog
        open={openFieldDialog}
        maxSize="xs"
        disableActions
        confirmButtonLabel=""
        dialogTitle={i18n.t("fields.add_field")}
      >
        <div>
          <ActionButton
            icon={<FormatListBulletedIcon />}
            text={i18n.t("fields.add_new_field")}
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              onClick: handleCustomFieldSelectorDialog,
              fullWidth: true,
              className: css.existingFieldButton
            }}
            keepTextOnMobile
          />
          <ActionButton
            icon={<SearchIcon />}
            text={i18n.t("fields.add_existing_field")}
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              disabled: isSelectedSubform,
              onClick: handleExistingFieldDialog,
              fullWidth: true,
              className: css.existingFieldButton
            }}
            keepTextOnMobile
          />
          <ActionButton
            icon={<CloseIcon />}
            text={i18n.t("buttons.cancel")}
            type={ACTION_BUTTON_TYPES.default}
            isCancel
            rest={{
              onClick: handleClose,
              fullWidth: true,
              className: css.cancelButton
            }}
            keepTextOnMobile
          />
        </div>
      </ActionDialog>
      <CustomFieldSelectorDialog key="custom-field-selector-dialog" isSubform={isSelectedSubform} />
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  getValues: PropTypes.func
};

export default Component;
