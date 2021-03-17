import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import { useDispatch, batch } from "react-redux";

import ActionDialog, { useDialog } from "../../../../../action-dialog";
import CustomFieldSelectorDialog from "../custom-field-selector-dialog";
import { useI18n } from "../../../../../i18n";
import { CUSTOM_FIELD_SELECTOR_DIALOG } from "../custom-field-selector-dialog/constants";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";
import { NAME as EXISTING_FIELD_DIALOG_NAME } from "../existing-field-dialog/constants";
import { useMemoizedSelector } from "../../../../../../libs";
import { getSelectedField, getSelectedSubform } from "../../selectors";
import { isSubformField, setInitialForms, setSubformData, toggleHideOnViewPage } from "../field-dialog/utils";
import { mergeOnSelectedSubform } from "../../action-creators";
import { useApp } from "../../../../../application";

import styles from "./styles.css";
import { NAME, CUSTOM_FIELD_DIALOG } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ getValues }) => {
  const i18n = useI18n();
  const css = useStyles();
  const dispatch = useDispatch();
  const { limitedProductionSite } = useApp();

  const { setDialog, dialogOpen, dialogClose } = useDialog(CUSTOM_FIELD_DIALOG);

  const selectedField = useMemoizedSelector(state => getSelectedField(state));
  const selectedSubform = useMemoizedSelector(state => getSelectedSubform(state));

  const isSubform = isSubformField(selectedField);
  const isSelectedSubform = selectedSubform.toSeq().size > 0 && isSubform;

  const handleDialog = () => {
    if (isSubform) {
      dialogClose();

      if (getValues) {
        const selectedFieldName = selectedField?.get("name");
        const data = getValues({ nest: true });
        const subformData = setInitialForms(data.subform_section);
        const fieldData = setSubformData(toggleHideOnViewPage(data[selectedFieldName]), subformData);

        dispatch(mergeOnSelectedSubform({ subform: subformData, subformField: fieldData }));
      }
    }
    setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: true });
  };

  const handleExistingFieldDialog = () => {
    batch(() => {
      setDialog({ dialog: EXISTING_FIELD_DIALOG_NAME, open: true });
    });
  };

  const handleCustomFieldSelectorDialog = () => {
    batch(() => {
      setDialog({ dialog: CUSTOM_FIELD_SELECTOR_DIALOG, open: true });
    });
  };

  const handleClose = () => {
    if (isSubform && selectedSubform.toSeq().size) {
      setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: true });
    }
    dialogClose();
  };

  const renderAddExistingFieldButton = !isSubform && (
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
  );

  return (
    <>
      <ActionButton
        icon={<AddIcon />}
        text={i18n.t("fields.add_field")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleDialog,
          hide: limitedProductionSite
        }}
      />
      <ActionDialog
        open={dialogOpen}
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
          {renderAddExistingFieldButton}
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
