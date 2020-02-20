/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "formik-material-ui";
import {
  Box,
  Dialog,
  Button,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FastField } from "formik";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import some from "lodash/some";

import { useI18n } from "../../../../i18n";
import { DOCUMENT_FIELD_NAME } from "../../constants";
import DateField from "../date-field";
import styles from "../../styles.css";

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
  removeFunc,
  field
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [dialog, setDialog] = useState(false);
  const { attachment_url: attachmentUrl } = value;

  const fields = buildAttachmentFieldsObject(name, index);

  const handleClose = () => {
    if (!some(value)) {
      removeFunc(index);
    }
    resetOpenLastDialog();
    setDialog(false);
  };

  const handleOpen = () => {
    setDialog(true);
  };

  const handleRemove = () => {
    removeFunc(index);
    handleClose();
  };

  const supportingInputsProps = {
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

  return (
    <>
      <div className={css.attachment}>
        <div className={css.attachmentMeta}>
          <span>
            {value.date && i18n.l("date.formats.default", value.date)}
          </span>
          {value.description}
        </div>
        <div>
          <IconButton onClick={handleOpen}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </div>

      <Dialog
        open={open || dialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
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
              <Button href={attachmentUrl}>{i18n.t("buttons.download")}</Button>
            ) : (
              <AttachmentInput
                fields={fields}
                attachment={attachment}
                value={value.attachment}
                name={name}
              />
            )}
            {mode.isShow || (
              <IconButton onClick={handleRemove}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>

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
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            disableElevation
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

DocumentField.displayName = DOCUMENT_FIELD_NAME;

DocumentField.propTypes = {
  attachment: PropTypes.string.isRequired,
  field: PropTypes.object,
  index: PropTypes.number.isRequired,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  open: PropTypes.bool,
  removeFunc: PropTypes.func.isRequired,
  resetOpenLastDialog: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired
};

export default DocumentField;
