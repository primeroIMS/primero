import { cleanUpFilters } from "../records";

import * as Actions from "./actions";

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
        return `${namespace}/${Actions.RESET_CHIPS}`;
      case "radio":
        return `${namespace}/${Actions.RESET_RADIO_BUTTON}`;
      case "multi_toggle":
        return `${namespace}/${Actions.RESET_RANGE_BUTTON}`;
      default:
        return Actions.RESET_PANELS;
    }
  })(payload.type);

  dispatch({
    type: action,
    payload
  });
};
