/* eslint-disable react/no-multi-comp  */
/* eslint-disable react/display-name */

import React, { useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
import useForm, { FormContext } from "react-hook-form";

import FormSection from "./components/form-section";
import { buildFormModeObject } from "./helpers";

const Component = ({
  formSections,
  onSubmit,
  validations,
  formMode,
  initialValues,
  formRef
}) => {
  const formMethods = useForm({
    ...(initialValues && { defaultValues: initialValues }),
    ...(validations && { validationSchema: validations })
  });

  const modeObject = buildFormModeObject(formMode);

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      formMethods.handleSubmit(onSubmit)(e);
    }
  }));

  const renderFormSections = () =>
    formSections.map(formSection => (
      <FormSection formSection={formSection} key={formSection.unique_id} />
    ));

  return (
    <FormContext {...formMethods} formMode={modeObject}>
      <form noValidate>{renderFormSections(formSections)}</form>
    </FormContext>
  );
};

Component.displayName = "Form";

Component.propTypes = {
  formMode: PropTypes.string.isRequired,
  formRef: PropTypes.object.isRequired,
  formSections: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  validations: PropTypes.object
};

export default forwardRef((props, ref) => (
  <Component {...props} formRef={ref} />
));
