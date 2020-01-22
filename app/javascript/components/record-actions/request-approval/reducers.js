import { fromJS, Map, List } from "immutable";

import { mergeRecord } from "../../../libs";

import { APPROVE_RECORD_SUCCESS } from "./actions";

const DEFAULT_STATE = Map({ data: List([]) });

export const reducers = namespace => (
  state = DEFAULT_STATE,
  { type, payload }
) => {
  switch (type) {
    case `${namespace}/${APPROVE_RECORD_SUCCESS}`: {
      const { data } = payload;
      const index = state.getIn("data").findIndex(r => r.get("id") === data.id);

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
