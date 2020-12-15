import { fromJS } from "immutable";

import { listEntriesToRecord } from "../../libs";

import NAMESPACE from "./namespace";
import actions from "./actions";
import { ChangeLogsRecord } from "./records";

const DEFAULT_STATE = fromJS({ data: [] });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_CHANGE_LOGS_SUCCESS:
      return state.set("data", listEntriesToRecord(payload.data, ChangeLogsRecord));
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
