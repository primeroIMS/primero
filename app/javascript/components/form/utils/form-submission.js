/* eslint-disable import/prefer-default-export */
import isEmpty from "lodash/isEmpty";

import { enqueueSnackbar } from "../../notifier";

import { touchedFormData } from "./touched-data";

export const submitHandler = ({
  dispatch,
  formMethods,
  formMode,
  i18n,
  initialValues,
  onSubmit,
  submitAllFields
}) => () => {
  // formState needs to be called here otherwise touched will not work.
  // https://github.com/react-hook-form/react-hook-form-website/issues/154
  const touchedFields = formMethods?.formState?.touched;

  return {
    submitForm(e) {
      formMethods.handleSubmit(data => {
        const changedFormData = touchedFormData(
          touchedFields,
          data,
          formMode.get("isEdit"),
          initialValues
        );

        if (isEmpty(changedFormData)) {
          return dispatch(
            enqueueSnackbar(i18n.t("messages.no_changes"), "error")
          );
        }

        return onSubmit(submitAllFields ? data : changedFormData);
      })(e);
    }
  };
};
