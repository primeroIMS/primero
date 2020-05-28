/* eslint-disable import/prefer-default-export */

import { ASSIGN_DIALOG } from "../constants";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../actions";
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
        action: SET_DIALOG,
        payload: {
          dialog: ASSIGN_DIALOG,
          open: false
        }
      },
      {
        action: SET_DIALOG_PENDING,
        payload: {
          pending: false
        }
      }
    ]
  }
});

export const removeBulkAssignMessages = recordType => ({
  type: `${recordType}/${actions.CLEAR_BULK_ASSIGN_MESSAGES}`
});
