import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchLookup = id => {
  const path = `${RECORD_PATH.lookups}/${id}`;

  return {
    type: actions.FETCH_LOOKUP,
    api: {
      path
    }
  };
};
export const clearSelectedLookup = () => ({
  type: actions.CLEAR_SELECTED_LOOKUP
});
