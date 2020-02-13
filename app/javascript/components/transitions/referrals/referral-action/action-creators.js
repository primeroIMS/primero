import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const referralDone = ({
  message,
  recordId,
  recordType,
  transistionId
}) => {
  return {
    type: actions.REFERRAL_DONE,
    api: {
      path: `${recordType}/${recordId}/referrals/${transistionId}`,
      method: "DELETE",
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
