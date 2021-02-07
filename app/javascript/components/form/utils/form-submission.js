/* eslint-disable import/prefer-default-export */
import isEmpty from "lodash/isEmpty";

import { enqueueSnackbar } from "../../notifier";

import { touchedFormData } from "./touched-data";

export const submitHandler = ({
  data,
  dispatch,
  dirtyFields,
  isEdit = false,
  initialValues,
  onSubmit,
  submitAllFields,
  message = null,
  submitAlways
}) => {
  // formState needs to be called here otherwise touched will not work.
  // https://github.com/react-hook-form/react-hook-form-website/issues/154
  const changedFormData = touchedFormData(dirtyFields, data, isEdit, initialValues);

  if (isEmpty(changedFormData) && !submitAlways) {
    return dispatch(
      enqueueSnackbar(message, {
        ...(!message && { messageKey: "messages.no_changes" }),
        type: "error"
      })
    );
  }

  return onSubmit(submitAllFields ? data : changedFormData);
};
