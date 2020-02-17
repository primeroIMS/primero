import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { TRANSITIONS_TYPES } from "../../constants";
import { RECORD_PATH, REJECTED } from "../../../../config";

import actions from "./actions";

export const revokeTransition = ({
  message,
  recordType,
  recordId,
  transitionType,
  transitionId
}) => {
  const isReferral = transitionType === TRANSITIONS_TYPES.referral;
  const path = `${recordType}/${recordId}/${
    isReferral ? "referrals" : "transfers"
  }/${transitionId}`;
  const method = isReferral ? "DELETE" : "PATCH";
  const body = isReferral
    ? {}
    : {
        data: {
          status: REJECTED
        }
      };

  return {
    type: actions.REVOKE_TRANSITION,
    api: {
      path,
      method,
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        },
        redirectWithIdFromResponse: false,
        redirect: `/${RECORD_PATH.cases}`
      }
    }
  };
};

export default revokeTransition;
