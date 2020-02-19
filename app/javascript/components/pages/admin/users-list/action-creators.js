import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchUsers = data => {
  const { options } = data || {};

  return {
    type: actions.USERS,
    api: {
      path: RECORD_PATH.users,
      params: options
    }
  };
};
