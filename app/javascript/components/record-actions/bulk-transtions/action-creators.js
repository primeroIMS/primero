/* eslint-disable import/prefer-default-export */

import { CLEAR_DIALOG } from "../../action-dialog";
import { generatePath } from "../transitions/components/utils";
import { METHODS } from "../../../config";

import actions from "./actions";

export const saveBulkAssignedUser = (recordType, recordsIds, body) => ({
  type: `${recordType}/${actions.BULK_ASSIGN_USER_SAVE}`,
  api: {
    path: generatePath(actions.BULK_ASSIGN, null, recordsIds),
    method: METHODS.POST,
    body,
    successCallback: [
      {
        action: CLEAR_DIALOG
      }
    ]
  }
});

export const removeBulkAssignMessages = recordType => ({
  type: `${recordType}/${actions.CLEAR_BULK_ASSIGN_MESSAGES}`
});
