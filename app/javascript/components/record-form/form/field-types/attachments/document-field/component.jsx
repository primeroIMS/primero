// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable jsx-a11y/label-has-for */
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { TextField } from "formik-mui";
import {
  Box,
  Dialog,
  Button,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Drawer,
  useMediaQuery
} from "@mui/material";
import { Formik, FastField, Form } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import some from "lodash/some";
import MenuIcon from "@mui/icons-material/Menu";

import { useI18n } from "../../../../../i18n";
import { DOCUMENT_FIELD_NAME } from "../../../constants";
import DateField from "../../date-field";
import css from "../../../styles.css";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import ActionDialog from "../../../../../action-dialog";
import TickField from "../../tick-field";
import { MODULES } from "../../../../../../config";
import { buildDocumentSchema } from "../../../validations";
import AttachmentInput from "../attachment-input";
import { ATTACHMENT_FIELDS, ATTACHMENT_FIELDS_INITIAL_VALUES } from "../constants";
import downloadUrl from "../../../../../../libs/download-url";

import DocumentRow from "./components/document-row";
import DocumentDelete from "./components/document-delete";
import viewerCss from "./styles.css";
import FieldValue from "./components/field-value";
import Content from "./components/content";

function DocumentField({
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
}) {
  const i18n = useI18n();
  const params = useParams();
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const [dialog, setDialog] = useState(false);
  const [metaDrawerOpen, setMetaDrawerOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const {
    attachment_url: attachmentUrl,
    id,
    _destroy: destroyed,
    file_name: fileName,
    content_type: contentType
  } = value;
  const primeroModule = arrayHelpers?.form?.values?.module_id || params.module;
  const isMRM = primeroModule === MODULES.MRM;
  const initialDocumentValues = value || ATTACHMENT_FIELDS_INITIAL_VALUES;
  const documentSchema = useMemo(() => buildDocumentSchema(i18n), [i18n]);

  if (destroyed) return null;

  const onSubmit = values => {
    arrayHelpers.replace(index, values);
    resetOpenLastDialog();
    setDialog(false);
  };

  const removeFunc = () => {
    if (attachmentUrl) {
      arrayHelpers.replace(index, { _destroy: true, id, attachment_type: attachment });
    } else {
      arrayHelpers.remove(index);
    }
  };

  const handleClose = async () => {
    if (!some(value)) {
      removeFunc();
    }
    resetOpenLastDialog();
    setDialog(false);
  };

  const handleOpenMetaDrawer = () => setMetaDrawerOpen(drawerOpen => !drawerOpen);

  const handleOpen = () => setDialog(true);

  const handleRemove = () => {
    removeFunc();
    resetOpenLastDialog();

    if (dialog) {
      handleClose();
    }
  };

  const handleAttachmentDownload = async () => {
    await downloadUrl(attachmentUrl, fileName);
  };

  const openDeleteConfirmation = () => setDeleteConfirmation(true);

  const closeDeleteConfirmation = () => setDeleteConfirmation(false);

  const supportingInputsProps = {
    disabled: mode.isShow,
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

  const dialogActionText = `buttons.${mode.isShow ? "close" : "save"}`;

  return (
    <>
      <DocumentRow handleOpen={handleOpen} document={value} handleDelete={openDeleteConfirmation} mode={mode} />
      <Dialog open={open || dialog} onClose={handleClose} maxWidth="xl" fullWidth>
        {attachmentUrl && mode.isShow ? (
          <div className={viewerCss.container}>
            <div className={viewerCss.title}>
              {mobileDisplay && (
                <ActionButton
                  type={ACTION_BUTTON_TYPES.icon}
                  icon={<MenuIcon />}
                  isTransparent
                  onClick={handleOpenMetaDrawer}
                />
              )}
              <h3 className={viewerCss.titleText}>{fileName}</h3>
              <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<CloseIcon />} isTransparent onClick={handleClose} />
            </div>
            <div className={viewerCss.viewerContainer}>
              <div className={viewerCss.viewer}>
                <Content
                  attachmentUrl={attachmentUrl}
                  contentType={contentType}
                  fileName={fileName}
                  mobileDisplay={mobileDisplay}
                  handleAttachmentDownload={handleAttachmentDownload}
                />
              </div>
              <Drawer
                open={!mobileDisplay || metaDrawerOpen}
                variant={mobileDisplay ? "temporary" : "persistent"}
                anchor="right"
                classes={{ paper: viewerCss.drawer, root: viewerCss.drawerRoot }}
              >
                {mobileDisplay && (
                  <div className={viewerCss.drawerHeader}>
                    <ActionButton
                      type={ACTION_BUTTON_TYPES.icon}
                      icon={<CloseIcon />}
                      isTransparent
                      onClick={handleOpenMetaDrawer}
                    />
                  </div>
                )}
                <div className={viewerCss.drawerContent}>
                  <FieldValue label={i18n.t("fields.document.content_type")} value={contentType} />
                  <FieldValue label={i18n.t("fields.document.date")} value={value[ATTACHMENT_FIELDS.date]} />
                  <FieldValue label={i18n.t("fields.document.comments")} value={value[ATTACHMENT_FIELDS.comments]} />
                </div>
              </Drawer>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={initialDocumentValues}
            validationSchema={documentSchema}
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize
            onSubmit={values => onSubmit(values)}
          >
            {({ handleSubmit, values }) => (
              <Form data-testid="document-dialog-form" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle className={css.title}>
                  <div className={css.titleText}>{title}</div>
                  <div>
                    <IconButton size="large" onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                </DialogTitle>
                <DialogContent>
                  <div className={css.attachmentUploadField}>
                    <AttachmentInput
                      fields={ATTACHMENT_FIELDS}
                      attachment={attachment}
                      value={value.attachment}
                      name={name}
                    />
                    {mode.isEdit && (values?.attachment || attachmentUrl) && (
                      <DocumentDelete onClick={openDeleteConfirmation} />
                    )}
                  </div>

                  {!isMRM && (
                    <Box my={2}>
                      <TickField
                        {...supportingInputsProps}
                        label={i18n.t("fields.document.is_current")}
                        name={ATTACHMENT_FIELDS.isCurrent}
                      />
                    </Box>
                  )}

                  <Box my={2}>
                    <FastField
                      component={TextField}
                      {...supportingInputsProps}
                      label={i18n.t("fields.document.name")}
                      name={ATTACHMENT_FIELDS.description}
                    />
                  </Box>
                  <Box my={2}>
                    <DateField
                      {...supportingInputsProps}
                      field={field}
                      name={ATTACHMENT_FIELDS.date}
                      label={i18n.t("fields.document.date")}
                      mode={mode}
                    />
                  </Box>
                  <Box my={2}>
                    <FastField
                      component={TextField}
                      size="small"
                      {...supportingInputsProps}
                      multiline
                      label={i18n.t("fields.document.comments")}
                      name={ATTACHMENT_FIELDS.comments}
                    />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    id={dialogActionText}
                    onClick={handleSubmit}
                    type="button"
                    color="primary"
                    variant="contained"
                    disableElevation
                  >
                    {i18n.t(dialogActionText)}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
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
}

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
