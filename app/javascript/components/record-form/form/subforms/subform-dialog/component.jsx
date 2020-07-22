import React from "react";
import { Formik, Form, getIn } from "formik";
import PropTypes from "prop-types";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import { object } from "yup";

import { fieldValidations } from "../../validations";
import FormSectionField from "../../form-section-field";
import { SUBFORM_DIALOG } from "../constants";
import ServicesSubform from "../services-subform";
import SubformMenu from "../subform-menu";
import { serviceHasReferFields } from "../../utils";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import SubformErrors from "../subform-errors";

import styles from "./styles.css";

const Component = ({
  index,
  field,
  mode,
  open,
  setOpen,
  title,
  dialogIsNew,
  i18n,
  formik,
  recordType,
  initialSubformValue
}) => {
  const css = makeStyles(styles)();

  const subformValues = getIn(
    formik.values,
    `${field.subform_section_id.unique_id}[${index}]`
  );

  const initialSubformValues = { ...initialSubformValue, ...subformValues };

  const initialSubformErrors = getIn(
    formik.errors,
    `${field.subform_section_id.unique_id}[${index}]`
  );

  const buildSchema = () => {
    const subformSchema = field.subform_section_id.fields.map(sf =>
      fieldValidations(sf, i18n)
    );

    return object().shape(Object.assign({}, ...subformSchema));
  };

  const handleClose = () => {
    setOpen({ open: false, index: null });
  };

  let boundSubmitForm = null;

  const bindSubmitForm = submitForm => {
    boundSubmitForm = submitForm;
  };

  const onSubmit = values => {
    formik.setFieldValue(
      `${field.subform_section_id.unique_id}[${index}]`,
      values,
      false
    );

    // Trigger validations only if the form was already submitted.
    if (formik.submitCount) {
      formik.validateForm();
    }
    handleClose();
  };

  const buttonDialogText = dialogIsNew ? "buttons.add" : "buttons.update";

  const renderSubform = (subformField, subformIndex) => {
    if (subformField.subform_section_id.unique_id === "services_section") {
      return (
        <ServicesSubform
          field={subformField}
          index={subformIndex}
          mode={mode}
        />
      );
    }

    return field.subform_section_id.fields.map(f => {
      const fieldProps = {
        name: `${field.name}[${index}].${f.name}`,
        field: f,
        mode,
        index,
        parentField: field
      };

      return (
        <Box my={3} key={f.name}>
          <FormSectionField {...fieldProps} />
        </Box>
      );
    });
  };

  if (index !== null) {
    const actionButton =
      mode.isEdit || mode.isNew ? (
        <ActionButton
          icon={<CheckIcon />}
          text={i18n.t(buttonDialogText)}
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            onClick: e => boundSubmitForm && boundSubmitForm(e)
          }}
        />
      ) : null;

    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle disableTypography>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>{title}</Box>
            <Box display="flex">
              {field.subform_section_id.unique_id === "services_section" &&
              mode.isShow &&
              serviceHasReferFields(formik.values.services_section[index]) ? (
                <SubformMenu
                  index={index}
                  values={formik.values.services_section}
                  recordType={recordType}
                />
              ) : null}
              <ActionButton
                icon={<CloseIcon />}
                type={ACTION_BUTTON_TYPES.icon}
                isTransparent
                rest={{
                  onClick: handleClose,
                  className: css.modalClosesBtn
                }}
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialSubformValues}
            validationSchema={buildSchema()}
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize
            onSubmit={values => onSubmit(values)}
          >
            {({ handleSubmit, submitForm, setErrors, setTouched, errors }) => {
              bindSubmitForm(submitForm);

              return (
                <Form autoComplete="off" onSubmit={handleSubmit}>
                  <SubformErrors
                    initialErrors={initialSubformErrors}
                    errors={errors}
                    setErrors={setErrors}
                    setTouched={setTouched}
                  />
                  {renderSubform(field, index)}
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
        <DialogActions>{actionButton}</DialogActions>
      </Dialog>
    );
  }

  return null;
};

Component.displayName = SUBFORM_DIALOG;

Component.propTypes = {
  dialogIsNew: PropTypes.bool.isRequired,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  initialSubformValue: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  recordType: PropTypes.string,
  setOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Component;
