import { fromJS } from "immutable";

import { mergeRecord } from "../../../../libs";

import actions from "./actions";

const DEFAULT_STATE = fromJS({ data: [] });

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.REFERRAL_DONE_SUCCESS: {
      const { data } = payload;
      const index = state.get("data").findIndex(r => r.get("id") === data.id);

      if (index !== -1) {
        return state
          .updateIn(["data", index], u => mergeRecord(u, fromJS(data)))
          .set("errors", false);
      }

      return state
        .update("data", u => {
          return u.push(fromJS(data));
        })
        .set("errors", false);
    }
    default:
      return state;
  }
};
