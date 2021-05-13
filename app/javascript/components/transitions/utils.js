/* eslint-disable import/prefer-default-export */
import { fetchRecord } from "../records";
import { RECORD_PATH, REJECTED } from "../../config";

export const fetchRecordCallback = ({ recordType, recordId, approvalType = null }) => {
  const callback = fetchRecord(recordType, recordId, true);

  return {
    ...callback,
    api: {
      ...callback.api,
      successCallback: [
        {
          action: `${recordType}/REDIRECT`,
          ...(approvalType === REJECTED
            ? { redirectWithIdFromResponse: false, redirect: `/${RECORD_PATH.cases}` }
            : { redirectWithIdFromResponse: true, redirect: `/${RECORD_PATH.cases}` })
        }
      ],
      failureCallback: [
        { action: `${recordType}/REDIRECT`, redirectWithIdFromResponse: false, redirect: `/${RECORD_PATH.cases}` }
      ]
    }
  };
};
