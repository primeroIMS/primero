// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { CLEAR_DIALOG } from "../../action-dialog";
import { generatePath } from "../transitions/components/utils";
import { METHODS } from "../../../config";

import actions from "./actions";

export const saveBulkAssignedUser = (recordType, recordsIds, selectedRecordsLength, body) => ({
  type: `${recordType}/${actions.BULK_ASSIGN_USER_SAVE}`,
  api: {
    path: generatePath(actions.BULK_ASSIGN, null, recordsIds),
    method: METHODS.POST,
    body,
    successCallback: [
      {
        action: CLEAR_DIALOG
      },
      {
        action: `${recordType}/${actions.BULK_ASSIGN_USER_SELECTED_RECORDS_LENGTH}`,
        payload: {
          selectedRecordsLength
        }
      }
    ]
  }
});

export const removeBulkAssignMessages = recordType => ({
  type: `${recordType}/${actions.CLEAR_BULK_ASSIGN_MESSAGES}`
});
