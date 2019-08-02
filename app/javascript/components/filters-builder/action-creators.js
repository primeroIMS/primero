import * as RecordListActions from "components/record-list/actions";
import { cleanUpFilters } from "components/record-list/helpers";
import * as Actions from "./actions";

export const setExpandedPanel = payload => dispatch => {
  const action = (expanded => {
    if (expanded) {
      return Actions.SET_EXPANSION_PANEL;
    }
    return Actions.REMOVE_EXPANDED_PANEL;
  })(payload.expanded);

  dispatch({ type: action, payload });
};

export const collapsePanels = () => {
  return {
    type: Actions.RESET_PANELS
  };
};

export const applyFilters = data => dispatch => {
  dispatch({
    type: `${data.namespace}/SET_FILTERS`,
    payload: data.options
  });

  dispatch({
    type: `${data.namespace}/RECORDS`,
    api: {
      path: data.path,
      params: cleanUpFilters(data.options)
    }
  });
};

export const resetSinglePanel = (payload, namespace) => dispatch => {
  const action = (type => {
    switch (type) {
      case "chips":
        return `${namespace}/${RecordListActions.RESET_CHIPS}`;
      case "radio":
        return `${namespace}/${RecordListActions.RESET_RADIO_BUTTON}`;
      case "multi_toggle":
        return `${namespace}/${RecordListActions.RESET_RANGE_BUTTON}`;
      default:
        return Actions.RESET_PANELS;
    }
  })(payload.type);

  dispatch({
    type: action,
    payload
  });
};
