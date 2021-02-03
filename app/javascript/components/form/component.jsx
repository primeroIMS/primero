/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */

import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { yupResolver } from "@hookform/resolvers/yup";

import { HTTP_STATUS } from "../../config";
import { useI18n } from "../i18n";

import CancelPrompt from "./components/cancel-prompt";
import FormSection from "./components/form-section";
import { whichFormMode } from "./utils/which-mode";
import { submitHandler } from "./utils/form-submission";

const Component = ({
  formSections,
  onSubmit,
  validations,
  mode,
  initialValues,
  formRef,
  useCancelPrompt,
  formErrors,
  submitAllFields,
  onValid,
  useFormMode,
  renderBottom,
  submitAlways
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formMethods = useForm({
    mode: useFormMode || "onTouched",
    ...(initialValues && { defaultValues: initialValues }),
    ...(validations && { resolver: yupResolver(validations) })
  });
  const { formState, handleSubmit, setError, reset, errors } = formMethods;

  const formMode = whichFormMode(mode);

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods,
      handleSubmit,
      formMode,
      i18n,
      initialValues,
      onSubmit,
      submitAllFields,
      submitAlways
    })
  );

  useEffect(() => {
    const { isValid } = formState;

    if (onValid) {
      onValid(isValid);
    }
  }, [formState.isValid]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    formErrors
      ?.filter(error => error.get("status") === HTTP_STATUS.invalidRecord)
      .forEach(error => {
        setError(error.get("detail"), "", i18n.t(error.getIn(["message", 0])));
      });
  }, [formErrors]);

  useEffect(() => {
    reset(initialValues);
  }, [JSON.stringify(initialValues)]);

  const renderFormSections = () =>
    formSections.map(formSection => (
      <FormSection formSection={formSection} key={formSection.unique_id} errors={errors} />
    ));

  return (
    <FormProvider {...formMethods} formMode={formMode}>
      <CancelPrompt useCancelPrompt={useCancelPrompt} />
      <form noValidate>{renderFormSections(formSections)}</form>
      {renderBottom && renderBottom()}
    </FormProvider>
  );
};

Component.displayName = "Form";

Component.defaultProps = {
  formErrors: fromJS([]),
  mode: "new",
  onValid: null,
  submitAllFields: false,
  submitAlways: false
};

Component.propTypes = {
  formErrors: PropTypes.object,
  formRef: PropTypes.object.isRequired,
  formSections: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  mode: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  renderBottom: PropTypes.func,
  submitAllFields: PropTypes.bool,
  submitAlways: PropTypes.bool,
  useCancelPrompt: PropTypes.bool,
  useFormMode: PropTypes.oneOf(["onSubmit", "onBlur"]),
  validations: PropTypes.object
};

export default forwardRef((props, ref) => <Component {...props} formRef={ref} />);
