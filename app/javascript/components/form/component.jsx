/* eslint-disable react/no-multi-comp  */
/* eslint-disable react/display-name */

import React, { useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
import { useForm, FormContext } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import { enqueueSnackbar } from "../notifier";

import CancelPrompt from "./components/cancel-prompt";
import FormSection from "./components/form-section";
import { whichFormMode, touchedFormData } from "./utils";

const Component = ({
  formSections,
  onSubmit,
  validations,
  mode,
  initialValues,
  formRef,
  useCancelPrompt
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formMethods = useForm({
    ...(initialValues && { defaultValues: initialValues }),
    ...(validations && { validationSchema: validations })
  });

  const formMode = whichFormMode(mode);

  const touchedFields = formMethods?.formState?.touched;

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      formMethods.handleSubmit(data => {
        console.log(data)
        const changedFormData = touchedFormData(
          touchedFields,
          data,
          formMode.get("isEdit"),
          initialValues
        );

        if (!isEmpty(changedFormData)) {
          onSubmit(changedFormData);
        } else {
          dispatch(enqueueSnackbar(i18n.t("messages.no_changes"), "error"));
        }
      })(e);
    }
  }));

  const renderFormSections = () =>
    formSections.map(formSection => (
      <FormSection formSection={formSection} key={formSection.unique_id} />
    ));

  return (
    <FormContext {...formMethods} formMode={formMode}>
      <CancelPrompt useCancelPrompt={useCancelPrompt} />
      <form noValidate>{renderFormSections(formSections)}</form>
    </FormContext>
  );
};

Component.displayName = "Form";

Component.propTypes = {
  formRef: PropTypes.object.isRequired,
  formSections: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  mode: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  useCancelPrompt: PropTypes.bool,
  validations: PropTypes.object
};

export default forwardRef((props, ref) => (
  <Component {...props} formRef={ref} />
));
