/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField as MuiTextField } from "formik-material-ui";
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

import { useI18n } from "../../i18n";

import DateField from "./DateField";
import styles from "./styles.css";

const DocumentField = ({
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

  const handleClose = () => {
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
    field,
    mode,
    readOnly: mode.isShow,
    fullWidth: true,
    autoComplete: "off",
    InputProps: {
      readOnly: mode.isShow,
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
          {value.document_description}
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
            <label htmlFor={`${name}[${index}][document]`}>
              <Button variant="outlined" color="primary" component="span">
                {i18n.t("fields.file_upload_box.select_file_button_text")}
              </Button>
            </label>
            <div className={css.attachmentInputField}>
              <FastField
                id={`${name}[${index}][document]`}
                name={`${name}[${index}][document]`}
                type="file"
              />
            </div>
            <IconButton onClick={handleRemove}>
              <DeleteIcon />
            </IconButton>
          </div>
          <Box my={2}>
            <FastField
              component={MuiTextField}
              {...supportingInputsProps}
              label={i18n.t("fields.document.name")}
              name={`${name}[${index}][document_description]`}
            />
          </Box>
          <Box my={2}>
            <DateField
              {...supportingInputsProps}
              readOnly={mode.isShow}
              name={`${name}[${index}][date]`}
              label={i18n.t("fields.document.date")}
            />
          </Box>
          <Box my={2}>
            <FastField
              component={MuiTextField}
              margin="dense"
              {...supportingInputsProps}
              multiline
              label={i18n.t("fields.document.comments")}
              name={`${name}[${index}][comments]`}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

DocumentField.propTypes = {
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
