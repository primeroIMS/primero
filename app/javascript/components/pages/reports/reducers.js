import { fromJS, Map } from "immutable";
import { mapEntriesToRecord } from "libs";
import NAMESPACE from "./namespace";
import * as Actions from "./actions";
import * as R from "./records";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_REPORTS_SUCCESS:
      return state
        .set("reports", mapEntriesToRecord(payload.data, R.ReportRecord))
        .set("errors", false);
    case Actions.FETCH_REPORTS_FAILURE:
      return state.set("errors", true);
    case Actions.FETCH_REPORT_SUCCESS:
      return state
        .set("selectedReport", fromJS(payload.data))
        .set("errors", false);
    case Actions.FETCH_REPORT_FAILURE:
      return state.set("errors", true);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
