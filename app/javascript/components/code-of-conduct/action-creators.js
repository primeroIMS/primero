/* eslint-disable import/prefer-default-export */

import { METHODS, RECORD_PATH } from "../../config";

import actions from "./actions";

export const acceptCodeOfConduct = ({ userId, codeOfConductId, path }) => {
  const body = { data: { code_of_conduct_id: codeOfConductId } };

  return {
    type: actions.ACCEPT_CODE_OF_CONDUCT,
    api: {
      path: `${RECORD_PATH.users}/${userId}`,
      method: METHODS.PATCH,
      body,
      successCallback: {
        action: "code_of_conduct/REDIRECT",
        redirect: path
      }
    }
  };
};
