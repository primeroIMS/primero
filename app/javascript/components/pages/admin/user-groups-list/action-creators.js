import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchUserGroups = data => {
  const { options } = data || {};

  return {
    type: actions.USER_GROUPS,
    api: {
      path: RECORD_PATH.user_groups,
      params: options
    }
  };
};
