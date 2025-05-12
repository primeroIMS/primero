// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import isEmpty from "lodash/isEmpty";

import { enqueueSnackbar } from "../../notifier/action-creators";

import { touchedFormData } from "./touched-data";

export const submitHandler = ({
  data,
  dispatch,
  dirtyFields,
  isEdit = false,
  initialValues,
  onSubmit,
  submitAllFields,
  submitAllArrayData = false,
  message = null,
  submitAlways,
  transformBeforeSend
}) => {
  // formState needs to be called here otherwise touched will not work.
  // https://github.com/react-hook-form/react-hook-form-website/issues/154
  const changedFormData = touchedFormData(dirtyFields, data, isEdit, initialValues, submitAllArrayData);

  if (isEmpty(changedFormData) && !submitAlways) {
    return dispatch(
      enqueueSnackbar(message, {
        ...(!message && { messageKey: "messages.no_changes" }),
        type: "error"
      })
    );
  }
  const dataToSubmit = submitAllFields ? data : changedFormData;

  return onSubmit(transformBeforeSend ? transformBeforeSend(dataToSubmit) : dataToSubmit);
};
