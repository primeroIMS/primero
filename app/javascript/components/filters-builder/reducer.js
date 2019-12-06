import { fromJS } from "immutable";
import { merge } from "lodash";

import {
  SET_FILTERS,
  ADD_CHECKBOX,
  ADD_SWITCH_BUTTON,
  ADD_CHIP,
  DELETE_CHECKBOX,
  DELETE_SWITCH_BUTTON,
  DELETE_CHIP,
  ADD_SELECT,
  ADD_RANGE_BUTTON,
  ADD_RADIO_BUTTON,
  ADD_SELECT_RANGE,
  ADD_DATES_RANGE,
  RESET_CHIPS,
  RESET_RANGE_BUTTON,
  RESET_RADIO_BUTTON,
  SET_RECORD_SEARCH,
  SET_SAVED_FILTERS,
  CLEAR_FILTERS,
  SAVE_DASHBOARD_FILTERS,
  CLEAR_DASHBOARD_FILTERS
} from "./actions";

const DEFAULT_STATE = fromJS({
  cases: [],
  incidents: [],
  tracing_requests: []
});

// eslint-disable-next-line import/prefer-default-export
export const reducers = namespace => (
  state = DEFAULT_STATE,
  { type, payload }
) => {
  switch (type) {
    case `${namespace}/${SET_FILTERS}`:
      return state.set("filters", merge({ ...state.get("filters") }, payload));
    case `${namespace}/${ADD_CHECKBOX}`:
    case `${namespace}/${ADD_SWITCH_BUTTON}`:
    case `${namespace}/${ADD_CHIP}`:
      return state.setIn(
        ["filters", payload.fieldName],
        [...state.getIn(["filters", payload.fieldName]), payload.data]
      );
    case `${namespace}/${DELETE_CHECKBOX}`:
    case `${namespace}/${DELETE_SWITCH_BUTTON}`:
    case `${namespace}/${DELETE_CHIP}`:
      return state.setIn(
        ["filters", payload.fieldName],
        state
          .getIn(["filters", payload.fieldName])
          .filter(item => item !== payload.data)
      );
    case `${namespace}/${ADD_SELECT}`:
    case `${namespace}/${ADD_RANGE_BUTTON}`:
    case `${namespace}/${ADD_RADIO_BUTTON}`:
      return state.setIn(["filters", payload.fieldName], payload.data);
    case `${namespace}/${ADD_SELECT_RANGE}`:
      return state.setIn(["filters", payload.fieldName, "value"], payload.data);
    case `${namespace}/${ADD_DATES_RANGE}`:
      return state
        .setIn(
          ["filters", payload.fieldName, "from"],
          payload.from || state.getIn(["filters", payload.fieldName, "from"])
        )
        .setIn(
          ["filters", payload.fieldName, "to"],
          payload.to || state.getIn(["filters", payload.fieldName, "to"])
        );
    case `${namespace}/${RESET_CHIPS}`:
      return state.setIn(["filters", payload.field_name], []);
    case `${namespace}/${RESET_RANGE_BUTTON}`:
      return state.setIn(["filters", payload.field_name], []);
    case `${namespace}/${RESET_RADIO_BUTTON}`:
      return state.setIn(["filters", payload.field_name], "");
    case `${namespace}/${SET_RECORD_SEARCH}`:
      return state.setIn(["filters", "query"], payload);
    case `${namespace}/${SET_SAVED_FILTERS}`:
      return state.mergeIn(["filters"], {
        ...state.get("filters"),
        ...payload
      });
    case `${namespace}/${CLEAR_FILTERS}`:
      return state.set("filters", payload);
    case `${namespace}/${SAVE_DASHBOARD_FILTERS}`:
      return state.set("dashboardFilters", fromJS(payload));
    case `${namespace}/${CLEAR_DASHBOARD_FILTERS}`:
      return state.set("dashboardFilters", fromJS({}))
    default:
      return state;
  }
};
