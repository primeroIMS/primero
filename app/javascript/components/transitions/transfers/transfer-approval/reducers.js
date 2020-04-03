import { fromJS } from "immutable";
import { findKey } from "lodash";

import { mergeRecord } from "../../../../libs";
import { RECORD_TYPES } from "../../../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({ data: [] });

export default (state = DEFAULT_STATE, { type, payload }) => {
  let newState = state;

  switch (type) {
    case actions.APPROVE_TRANSFER_SUCCESS: {
      const transferData = newState.getIn(["transitions", "data"]);
      const { data } = payload;
      const { record } = data;

      delete data.record;
      const transferIndex = transferData.findIndex(
        r => r.get("id") === data.id
      );

      if (transferIndex !== -1) {
        newState = newState.updateIn(
          ["transitions", "data", transferIndex],
          u => mergeRecord(u, fromJS(data))
        );
      } else {
        newState = newState.updateIn(["transitions", "data"], u => {
          return u.push(fromJS(data));
        });
      }

      if (record) {
        const recordType = findKey(
          RECORD_TYPES,
          value => value === data.record_type
        );
        const recordData = newState.getIn([recordType, "data"]);
        const recordIndex = recordData
          ? recordData.findIndex(r => r.get("id") === record.id)
          : -1;

        if (recordIndex !== -1) {
          newState = newState
            .updateIn([recordType, "data", recordIndex], u =>
              mergeRecord(u, fromJS(record))
            )
            .setIn([recordType, "errors"], false);
        } else {
          newState = newState
            .updateIn([recordType, "data"], u => {
              return u.push(fromJS(record));
            })
            .setIn([recordType, "errors"], false);
        }
      }

      return newState;
    }
    default:
      return newState;
  }
};
