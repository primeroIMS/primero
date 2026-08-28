/* eslint-disable import/prefer-default-export */

import { METHODS } from "../../config";

export const saveIntakeRecord = (intakeID, body) => {
  return {
    type: "intake/SAVE_INTAKE_RECORD",
    api: {
      path: `/intakes/${intakeID}`,
      method: METHODS.POST,
      body,
      queueOffline: false,
      queueAttachments: true,
      successCallback: {
        action: "intake/REDIRECT",
        redirect: `/intake/${intakeID}/thankyou`
      }
    }
  };
};
