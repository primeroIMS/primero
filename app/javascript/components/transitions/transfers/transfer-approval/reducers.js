import { fromJS } from "immutable";

import { mergeRecord } from "../../../../libs";

import actions from "./actions";

const DEFAULT_STATE = fromJS({ data: [] });

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.APPROVE_TRANSFER_SUCCESS: {
      const caseData = state.getIn(["cases", "data"]);
      const transferData = state.getIn(["transitions", "data"]);
      const { data } = payload;
      const record = data.record;
      delete data.record;
      const transferIndex = transferData.findIndex(r => r.get("id") === data.id);

      if (transferIndex !== -1) {
        state = state
          .updateIn(["transitions", "data", transferIndex], u => mergeRecord(u, fromJS(data)))
      } else {
        state = state
          .updateIn(["transitions", "data"], u => {
            return u.push(fromJS(data));
          })
      }

      if (record) {
        const index = caseData.findIndex(r => r.get("id") === record.id);

        if (index !== -1) {
          state = state
            .updateIn(["cases", "data", index], u => mergeRecord(u, fromJS(record)))
            .setIn(["cases", "errors"], false);
        } else {
          state = state
            .updateIn(["cases", "data"], u => {
              return u.push(fromJS(record));
            })
            .setIn(["cases", "errors"], false);
        }
      }

      return state;
    }
    default:
      return state;
  }
};
