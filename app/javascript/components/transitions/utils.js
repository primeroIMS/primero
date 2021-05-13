/* eslint-disable import/prefer-default-export */
import { fetchRecord } from "../records";
import { RECORD_PATH, REJECTED } from "../../config";

export const fetchRecordCallback = ({ recordType, recordId, approvalType = null }) => {
  const callback = fetchRecord(recordType, recordId, true);

  if (approvalType === REJECTED) {
    return {
      action: `${recordType}/REDIRECT`,
      redirectWithIdFromResponse: false,
      redirect: `/${RECORD_PATH.cases}`
    };
  }

  return {
    ...callback,
    api: {
      ...callback.api,
      successCallback: [
        { action: `${recordType}/REDIRECT`, redirectWithIdFromResponse: true, redirect: `/${RECORD_PATH.cases}` }
      ],
      failureCallback: [
        { action: `${recordType}/REDIRECT`, redirectWithIdFromResponse: false, redirect: `/${RECORD_PATH.cases}` }
      ]
    }
  };
};
