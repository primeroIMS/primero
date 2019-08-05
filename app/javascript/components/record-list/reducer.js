import { fromJS, Map } from "immutable";
import * as Actions from "./actions";

const DEFAULT_STATE = Map({});

export const recordListReducer = namespace => ({
  [namespace]: (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
      case `${namespace}/${Actions.RECORDS_STARTED}`:
        return state.set("loading", fromJS(payload)).set("errors", false);
      case `${namespace}/${Actions.RECORDS_FAILURE}`:
        return state.set("errors", true);
      case `${namespace}/${Actions.RECORDS_SUCCESS}`:
        return state
          .set("data", fromJS(payload.data))
          .set("metadata", fromJS(payload.metadata));
      case `${namespace}/${Actions.RECORDS_FINISHED}`:
        return state.set("loading", fromJS(payload));
      case `${namespace}/${Actions.SET_FILTERS}`:
        return state.set("filters", { ...state.get("filters"), ...payload });
      case `${namespace}/${Actions.ADD_CHECKBOX}`:
      case `${namespace}/${Actions.ADD_SWITCH_BUTTON}`:
      case `${namespace}/${Actions.ADD_CHIP}`:
        return state.setIn(
          ["filters", payload.id],
          [...state.getIn(["filters", payload.id]), payload.data]
        );
      case `${namespace}/${Actions.DELETE_CHECKBOX}`:
      case `${namespace}/${Actions.DELETE_SWITCH_BUTTON}`:
      case `${namespace}/${Actions.DELETE_CHIP}`:
        return state.setIn(
          ["filters", payload.id],
          state
            .getIn(["filters", payload.id])
            .filter(item => item !== payload.data)
        );
      case `${namespace}/${Actions.ADD_SELECT}`:
      case `${namespace}/${Actions.ADD_RANGE_BUTTON}`:
      case `${namespace}/${Actions.ADD_RADIO_BUTTON}`:
        return state.setIn(["filters", payload.id], payload.data);
      case `${namespace}/${Actions.ADD_SELECT_RANGE}`:
        return state.setIn(["filters", payload.id, "value"], payload.data);
      case `${namespace}/${Actions.ADD_DATES_RANGE}`:
        return state
          .setIn(
            ["filters", payload.id, "from"],
            payload.from || state.getIn(["filters", payload.id, "from"])
          )
          .setIn(
            ["filters", payload.id, "to"],
            payload.to || state.getIn(["filters", payload.id, "to"])
          );
      case `${namespace}/${Actions.RESET_CHIPS}`:
        return state.setIn(["filters", payload.id], []);
      case `${namespace}/${Actions.RESET_RANGE_BUTTON}`:
      case `${namespace}/${Actions.RESET_RADIO_BUTTON}`:
        return state.setIn(["filters", payload.id], "");
      case `${namespace}/${Actions.SET_RECORD_SEARCH}`:
        return state.setIn(["filters", "query"], payload);
      default:
        return state;
    }
  }
});
