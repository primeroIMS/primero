import { fromJS, Map } from "immutable";
import * as Actions from "./actions";

const DEFAULT_STATE = Map({
  cases: [],
  incidents: [],
  tracing_requests: []
});

export const reducers = namespace => (
  state = DEFAULT_STATE,
  { type, payload }
) => {
  switch (type) {
    case `${namespace}/${Actions.SET_FILTERS}`:
      return state.mergeIn(["filters"], fromJS(payload));
    case `${namespace}/${Actions.ADD_CHECKBOX}`:
    case `${namespace}/${Actions.ADD_SWITCH_BUTTON}`:
    case `${namespace}/${Actions.ADD_CHIP}`:
      return state.mergeIn(
        ["filters", payload.fieldName],
        fromJS(payload.data)
      );
    case `${namespace}/${Actions.DELETE_CHECKBOX}`:
    case `${namespace}/${Actions.DELETE_SWITCH_BUTTON}`:
    case `${namespace}/${Actions.DELETE_CHIP}`:
      return state.setIn(
        ["filters", payload.fieldName],
        state
          .getIn(["filters", payload.fieldName])
          .filter(item => item !== payload.data)
      );
    case `${namespace}/${Actions.ADD_SELECT}`:
    case `${namespace}/${Actions.ADD_RANGE_BUTTON}`:
    case `${namespace}/${Actions.ADD_RADIO_BUTTON}`:
      return state.setIn(["filters", payload.fieldName], payload.data);
    case `${namespace}/${Actions.ADD_SELECT_RANGE}`:
      return state.setIn(["filters", payload.fieldName, "value"], payload.data);
    case `${namespace}/${Actions.ADD_DATES_RANGE}`:
      return state
        .setIn(
          ["filters", payload.fieldName, "from"],
          payload.from || state.getIn(["filters", payload.fieldName, "from"])
        )
        .setIn(
          ["filters", payload.fieldName, "to"],
          payload.to || state.getIn(["filters", payload.fieldName, "to"])
        );
    case `${namespace}/${Actions.RESET_CHIPS}`:
      return state.setIn(["filters", payload.field_name], []);
    case `${namespace}/${Actions.RESET_RANGE_BUTTON}`:
      return state.setIn(["filters", payload.field_name], []);
    case `${namespace}/${Actions.RESET_RADIO_BUTTON}`:
      return state.setIn(["filters", payload.field_name], "");
    case `${namespace}/${Actions.SET_RECORD_SEARCH}`:
      return state.setIn(["filters", "query"], payload);
    default:
      return state;
  }
};
