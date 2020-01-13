import { RECORD_PATH } from "../../../../config";

import { USERS } from "./actions";

export const fetchUsers = data => {
  const { options } = data || {};

  return {
    type: USERS,
    api: {
      path: RECORD_PATH.users,
      params: options
    }
  };
};
