import { fromJS, Map, List } from "immutable";

import { mergeRecord } from "../../../libs";

import * as Actions from "./actions";

const DEFAULT_STATE = Map({ data: List([]) });

export const reducers = namespace => (
  state = DEFAULT_STATE,
  { type, payload }
) => {
  switch (type) {
    case `${namespace}/${Actions.APPROVE_RECORD_SUCCESS}`: {
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
