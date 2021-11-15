/* eslint-disable jsx-a11y/label-has-for */
import { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "formik-material-ui";
import { Box, Dialog, Button, DialogContent, DialogActions, DialogTitle, IconButton } from "@material-ui/core";
import { FastField } from "formik";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import some from "lodash/some";

import DisableOffline from "../../../../disable-offline";
import { useI18n } from "../../../../i18n";
import { DOCUMENT_FIELD_NAME } from "../../constants";
import DateField from "../date-field";
import css from "../../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import ActionDialog from "../../../../action-dialog";
import { useThemeHelper } from "../../../../../libs";
import TickField from "../tick-field";

import { buildAttachmentFieldsObject } from "./utils";
import AttachmentInput from "./attachment-input";

const DocumentField = ({
  attachment,
  title,
  name,
  index,
  mode,
  open,
  resetOpenLastDialog,
  value,
  arrayHelpers,
  field
}) => {
  const i18n = useI18n();

  const { isRTL } = useThemeHelper();
  const [dialog, setDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const { attachment_url: attachmentUrl, id, _destroy: destroyed } = value;

  const fields = buildAttachmentFieldsObject(name, index);

  if (destroyed) return null;

  const removeFunc = () => {
    if (attachmentUrl) {
      arrayHelpers.replace(index, {
        _destroy: id,
        attachment_type: attachment
      });
    } else {
      arrayHelpers.remove(index);
    }
  };

  const handleClose = () => {
    if (!some(value)) {
      removeFunc();
    }
    resetOpenLastDialog();
    setDialog(false);
  };

  const handleOpen = () => {
    setDialog(true);
  };

  const handleRemove = () => {
    removeFunc();

    if (dialog) {
      handleClose();
    }
  };

  const openDeleteConfirmation = () => setDeleteConfirmation(true);

  const closeDeleteConfirmation = () => setDeleteConfirmation(false);

  const deleteButton = mode.isEdit && (
    <DisableOffline>
      <ActionButton
        id="delete-button"
        icon={<DeleteIcon />}
        type={ACTION_BUTTON_TYPES.icon}
        cancel
        rest={{
          onClick: openDeleteConfirmation
        }}
      />
    </DisableOffline>
  );

  const supportingInputsProps = {
    disabled: Boolean(attachmentUrl),
    fullWidth: true,
    autoComplete: "off",
    InputProps: {
      classes: {
        root: css.input
      }
    },
    InputLabelProps: {
      shrink: true,
      classes: {
        root: css.inputLabel
      }
    }
  };

  const dialogActionText = `buttons.${attachmentUrl ? "close" : "save"}`;
  const renderIcon = isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRightIcon />;

  return (
    <>
      <div className={css.attachment}>
        <div className={css.attachmentMeta}>
          <span>{value.date && i18n.l("date.formats.default", value.date)}</span>
          {value.description}
        </div>
        <div>
          {deleteButton}
          <IconButton onClick={handleOpen}>{renderIcon}</IconButton>
        </div>
      </div>

      <Dialog open={open || dialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle disableTypography className={css.title}>
          <div className={css.titleText}>{title}</div>
          <div>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className={css.attachmentUploadField}>
            {attachmentUrl ? (
              <ActionButton
                text="buttons.download"
                type={ACTION_BUTTON_TYPES.default}
                isTransparent
                rest={{
                  variant: "outlined",
                  component: "a",
                  href: attachmentUrl
                }}
              />
            ) : (
              <AttachmentInput fields={fields} attachment={attachment} value={value.attachment} name={name} />
            )}
            {mode.isShow || deleteButton}
          </div>

          <Box my={2}>
            <TickField
              {...supportingInputsProps}
              label={i18n.t("fields.document.is_current")}
              name={fields.isCurrent}
            />
          </Box>
          <Box my={2}>
            <FastField
              component={TextField}
              {...supportingInputsProps}
              label={i18n.t("fields.document.name")}
              name={fields.description}
            />
          </Box>
          <Box my={2}>
            <DateField
              {...supportingInputsProps}
              field={field}
              name={fields.date}
              label={i18n.t("fields.document.date")}
              mode={mode}
            />
          </Box>
          <Box my={2}>
            <FastField
              component={TextField}
              margin="dense"
              {...supportingInputsProps}
              multiline
              label={i18n.t("fields.document.comments")}
              name={fields.comments}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button id={dialogActionText} onClick={handleClose} color="primary" variant="contained" disableElevation>
            {i18n.t(dialogActionText)}
          </Button>
        </DialogActions>
      </Dialog>

      <ActionDialog
        open={deleteConfirmation}
        successHandler={handleRemove}
        cancelHandler={closeDeleteConfirmation}
        dialogTitle={`${i18n.t("fields.remove")} ${i18n.t("fields.document_upload_box")}`}
        dialogText={i18n.t("fields.remove_attachment_confirmation")}
        confirmButtonLabel={i18n.t("buttons.ok")}
      />
    </>
  );
};

DocumentField.displayName = DOCUMENT_FIELD_NAME;

DocumentField.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  attachment: PropTypes.string.isRequired,
  field: PropTypes.object,
  index: PropTypes.number.isRequired,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  open: PropTypes.bool,
  resetOpenLastDialog: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired
};

export default DocumentField;
