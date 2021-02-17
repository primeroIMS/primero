/* eslint-disable import/prefer-default-export */
import { fetchRecord } from "../records";
import { RECORD_PATH } from "../../config";

export const fetchRecordCallback = ({ recordType, recordId }) => {
  const callback = fetchRecord(recordType, recordId, true);

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
