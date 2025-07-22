// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { listEntriesToRecord } from "../../libs";

import NAMESPACE from "./namespace";
import actions from "./actions";
import { AccessLogsRecord } from "./records";

const DEFAULT_STATE = fromJS({ data: [] });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_ACCESS_LOGS_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.FETCH_ACCESS_LOGS_SUCCESS: {
      const { data, metadata } = payload;
      const newEntries = listEntriesToRecord(data, AccessLogsRecord);

      if (metadata.page > 1) {
        return state
          .set("data", state.get("data").concat(newEntries))
          .set("errors", false)
          .set("metadata", fromJS(metadata));
      }

      return state.set("data", newEntries).set("errors", false).set("metadata", fromJS(metadata));
    }
    case actions.FETCH_ACCESS_LOGS_FAILURE:
      return state.set("loading", false).set("errors", true);
    case actions.FETCH_ACCESS_LOGS_FINISHED:
      return state.set("loading", false).set("errors", false);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
