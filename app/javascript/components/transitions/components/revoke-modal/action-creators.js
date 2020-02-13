import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { TRANSITIONS_TYPES } from "../../constants";
import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const revokeTransition = ({
  // body,
  message,
  recordType,
  recordId,
  transitionType,
  transitionId
}) => {
  const isReferral = transitionType === TRANSITIONS_TYPES.referral;
  const path = isReferral
    ? `${recordType}/${recordId}/referrals/${transitionId}`
    : "PATH_TRANSFER";
  const method = isReferral ? "DELETE" : "PATCH";

  return {
    type: actions.REVOKE_TRANSITION,
    api: {
      path,
      method,
      // body,
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
        redirect: RECORD_PATH.cases
      }
    }
  };
};

export default revokeTransition;
