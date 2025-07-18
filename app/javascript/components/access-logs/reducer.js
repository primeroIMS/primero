// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { listEntriesToRecord } from "../../libs";

import NAMESPACE from "./namespace";
import actions from "./actions";
import { AccessLogsRecord } from "./records";

const DEFAULT_STATE = fromJS({ data: [] });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_ACCESS_LOGS_SUCCESS:
      return state.set("data", listEntriesToRecord(payload.data, AccessLogsRecord));
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
