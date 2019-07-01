import * as ControlActions from "components/filters-builder/filter-controls";
import * as Actions from "./actions";

export const setExpandedPanel = payload => {
  const action = (expanded => {
    if (expanded) {
      return Actions.SET_EXPANSION_PANEL;
    }
    return Actions.REMOVE_EXPANDED_PANEL;
  })(payload.expanded);

  return {
    type: action,
    payload
  };
};

export const collapsePanels = () => {
  return {
    type: Actions.RESET_PANELS
  };
};

export const resetSinglePanel = payload => dispatch => {
  const action = (type => {
    switch (type) {
      case "chips":
        return ControlActions.RESET_CHIPS;
      case "radio":
        return ControlActions.RESET_RADIO_BUTTON;
      case "multi_toogle":
        return ControlActions.RESET_RANGE_BUTTON;
      default:
        return Actions.RESET_PANELS;
    }
  })(payload.type);

  dispatch({
    type: action,
    payload: payload.panel
  });
};
