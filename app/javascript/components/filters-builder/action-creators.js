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

// // TODO: Should not exists!!
// export const removeExpandedPanel = payload => {
//   return {
//     type: Actions.REMOVE_EXPANDED_PANEL,
//     payload
//   };
// };

export const resetPanel = payload => dispatch => {
  const action = (type => {
    switch (type) {
      case "chips":
        return ControlActions.RESET_CHIPS;
      case "radio":
        return ControlActions.RESET_RADIO_BUTTON;
      default:
        // All panels should be reset from here
        return Actions.RESET_PANELS;
    }
  })(payload.type);

  dispatch({
    type: action,
    payload: payload.panel
  });
};
