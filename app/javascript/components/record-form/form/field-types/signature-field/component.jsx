// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import {
  FormHelperText,
  InputLabel,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton
} from "@mui/material";
// eslint-disable-next-line import/no-unresolved
import Signature from "@uiw/react-signature/canvas";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { FastField, Form, Formik, getIn, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { boolean, object, string } from "yup";
import isEmpty from "lodash/isEmpty";

import ActionButton from "../../../../action-button";
import { EMPTY_VALUE, SIGNATURE_FIELD_NAME } from "../../constants";
import css from "../styles.css";
import inputCss from "../../styles.css";
import { useI18n } from "../../../../i18n";
import { AssetJwt } from "../../../../asset-jwt";
import { FormAction } from "../../../../form";
import ActionDialog from "../../../../action-dialog";
import { ATTACHMENT_TYPES } from "../attachments/constants";

// Note: Using a hidden field 'touched' to track if user has interacted with the signature pad for validation.

function buildSchema(i18n) {
  return object().shape({
    signature_provided_by: string().required(
      i18n.t("fields.required_field", { field: i18n.t("fields.signature_provided_by") })
    ),
    touched: boolean().oneOf([true], i18n.t("fields.required_field", { field: i18n.t("fields.signature") }))
  });
}

function Component({ helperText, label, mode, name, field }) {
  const svg = useRef(null);
  const i18n = useI18n();
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [valuesToSave, setValuesToSave] = useState(null);
  const formikContext = useFormikContext();
  const value = getIn(formikContext.values, name);
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const hasError = getIn(formikContext.touched, name) && getIn(formikContext.errors, name);

  const signaturePadOptions = {
    size: 3,
    smoothing: 0.15,
    thinning: -0.99,
    streamline: 0.74,
    start: {
      taper: 0,
      cap: true
    },
    end: {
      taper: 0,
      cap: true
    }
  };

  const inputsProps = {
    disabled: mode.isShow,
    fullWidth: true,
    autoComplete: "off",
    InputProps: {
      classes: {
        root: inputCss.input
      }
    },
    InputLabelProps: {
      shrink: true,
      classes: {
        root: inputCss.inputLabel
      }
    }
  };

  const signatureDialogBtnText = `buttons.${!value?.attachment_url && value?.attachment ? "update" : "add"}_signature`;

  const handleOpen = event => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = event => {
    event?.preventDefault();
    setOpen(false);
  };

  const handleRemove = event => {
    event.preventDefault();
    formikContext.setFieldValue(name, null);
    handleClose();
  };

  const handleSave = async () => {
    if (!svg.current?.canvas) {
      return;
    }

    const dataURL = svg.current.canvas.toDataURL("image/png");

    formikContext.setFieldValue(`${name}.attachment`, dataURL.split(";base64,")[1]);
    formikContext.setFieldValue(`${name}.attachment_type`, ATTACHMENT_TYPES.signature);
    formikContext.setFieldValue(`${name}.content_type`, "image/png");
    formikContext.setFieldValue(`${name}.field_name`, name);
    formikContext.setFieldValue(`${name}.file_name`, "signature.png");
    formikContext.setFieldValue(`${name}.signature_provided_by`, valuesToSave?.signature_provided_by);

    handleClose();
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  const openAlert = values => {
    setValuesToSave(values);
    setAlertOpen(true);
  };

  const inputLabel = (
    <InputLabel shrink htmlFor={name} required={field.required} error={hasError}>
      {label}
    </InputLabel>
  );

  const signatureInfo = (signatureMetaField, labelFromField) => {
    const fieldValue = value?.[signatureMetaField];

    if (!fieldValue) return false;
    const selectedLabelFromField = field.getIn([labelFromField, i18n.locale], null);
    const signatureLabel = selectedLabelFromField || i18n.t(`fields.${signatureMetaField}`);

    return (
      <div>
        {signatureLabel}: <span>{fieldValue || EMPTY_VALUE}</span>
      </div>
    );
  };

  return (
    <div>
      {inputLabel}
      {isEmpty(value) && mode.isShow && EMPTY_VALUE}
      {isEmpty(value) && (mode.isEdit || mode.isNew) && (
        <div className={css.noSignatureProvided} aria-invalid={Boolean(hasError)}>
          {i18n.t("messages.no_signature_provided")}
        </div>
      )}
      {value && (value?.attachment_url || value?.attachment) && (
        <div>
          <div>
            <AssetJwt
              src={value.attachment_url || `data:image/png;base64,${value?.attachment}`}
              alt="Signature"
              className={css.signatureImage}
            />
            <div className={css.signatureDetails}>
              {signatureInfo("signature_provided_on")}
              {signatureInfo("signature_provided_by", "signature_provided_by_label")}
              {signatureInfo("signature_created_by_user")}
            </div>
          </div>
        </div>
      )}
      {(mode.isEdit || mode.isNew) && !value?.attachment_url && (
        <>
          <ActionButton icon={<HistoryEduIcon />} onClick={handleOpen} text={signatureDialogBtnText} />

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Formik
              initialValues={{ signature_provided_by: "", touched: false }}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={buildSchema(i18n)}
              enableReinitialize
              onSubmit={values => openAlert(values)}
            >
              {({ handleSubmit, setFieldValue, errors }) => {
                const handleSignatureTouched = () => {
                  setFieldValue(`touched`, true);
                };

                const handleClear = event => {
                  event.preventDefault();
                  svg.current?.clear();
                  setFieldValue(`touched`, false);
                };

                return (
                  <Form onSubmit={handleSubmit} autoComplete="off">
                    <DialogTitle className={inputCss.title}>
                      <div className={inputCss.titleText}>{label}</div>
                      <div>
                        <IconButton size="large" onClick={handleClose}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </DialogTitle>
                    <DialogContent>
                      <div className={css.signatureFieldContainer}>
                        <InputLabel shrink htmlFor={`${name}.signature`} required error={!!errors?.touched}>
                          {i18n.t("fields.signature")}
                        </InputLabel>
                        <div className={css.signaturePad} aria-invalid={!!errors?.touched}>
                          <Signature
                            ref={svg}
                            options={signaturePadOptions}
                            height={160}
                            width={mobileDisplay ? 330 : 566}
                            onMouseUp={handleSignatureTouched}
                            onTouchEnd={handleSignatureTouched}
                          />
                        </div>
                        {errors?.touched && (
                          <FormHelperText error className={css.signatureErrorText}>
                            {errors.touched}
                          </FormHelperText>
                        )}
                        <ActionButton onClick={handleClear} variant="outlined" text="buttons.clear_signature" />
                      </div>
                      <FastField
                        {...inputsProps}
                        component={TextField}
                        label={i18n.t("fields.signature_provided_by")}
                        name="signature_provided_by"
                      />
                      <FastField {...inputsProps} type="hidden" name="touched" />
                      {(mode.isEdit || mode.isNew) && helperText && <FormHelperText>{helperText}</FormHelperText>}
                    </DialogContent>
                    <DialogActions>
                      <FormAction
                        startIcon={<CheckIcon />}
                        text={i18n.t("buttons.save")}
                        options={{
                          type: "submit"
                        }}
                      />
                      <ActionButton
                        icon={<HistoryEduIcon />}
                        onClick={handleRemove}
                        variant="outlined"
                        text="buttons.remove_signature"
                      />
                      <ActionButton
                        onClick={handleClose}
                        variant="outlined"
                        icon={<CloseIcon />}
                        text="buttons.cancel"
                      />
                    </DialogActions>
                    <ActionDialog
                      open={alertOpen}
                      successHandler={handleSave}
                      cancelHandler={closeAlert}
                      dialogTitle={i18n.t("fields.signature_save_confirmation_title")}
                      dialogText={i18n.t("fields.signature_save_confirmation")}
                      confirmButtonLabel={i18n.t("buttons.save")}
                    />
                  </Form>
                );
              }}
            </Formik>
          </Dialog>
        </>
      )}
      {(mode.isEdit || mode.isNew) && helperText && (
        <FormHelperText error={hasError}>{hasError || helperText}</FormHelperText>
      )}
    </div>
  );
}

Component.displayName = SIGNATURE_FIELD_NAME;

Component.propTypes = {
  field: PropTypes.object,
  helperText: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.object,
  name: PropTypes.string
};

export default Component;
