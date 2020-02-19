import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchAgencies = data => {
  const { options } = data || {};

  return {
    type: actions.AGENCIES,
    api: {
      path: RECORD_PATH.agencies,
      params: options
    }
  };
};
