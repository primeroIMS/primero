import { fromJS } from "immutable";
import last from "lodash/last";

import { mergeRecord } from "../../../libs";

import { APPROVE_RECORD_SUCCESS } from "./actions";
import { APPROVAL_FORM_TYPES } from "./constants";

const DEFAULT_STATE = fromJS({ data: [] });

export default namespace => (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case `${namespace}/${APPROVE_RECORD_SUCCESS}`: {
      const { data } = payload;
      const { record } = data;
      const index = state.get("data").findIndex(r => r.get("id") === record.id);

      if (index !== -1) {
        return state
          .updateIn(["data", index], u => mergeRecord(u, fromJS(record)))
          .set("errors", false);
      }

      return state
        .update("data", u => {
          return u.push(fromJS(record));
        })
        .set("errors", false);
    }
    default:
      return state;
  }
};
