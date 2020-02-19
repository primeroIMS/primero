import { fromJS } from "immutable";

import { mapEntriesToRecord } from "../../../libs";

import actions from "./actions";
import ExportRecord from "./records";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_EXPORTS_SUCCESS: {
      return state
        .set("data", mapEntriesToRecord(payload.data, ExportRecord, false))
        .set("metadata", fromJS(payload.metadata));
    }
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
