import {
  SET_FILTERS,
  DELETE_SWITCH_BUTTON,
  ADD_SWITCH_BUTTON
} from "../../actions";

export const setSwitchButton = (payload, namespace) => {
  return {
    type: `${namespace}/${SET_FILTERS}`,
    payload
  };
};

export const setSwitchValue = (payload, namespace) => {
  return {
    type: payload.included
      ? `${namespace}/${DELETE_SWITCH_BUTTON}`
      : `${namespace}/${ADD_SWITCH_BUTTON}`,
    payload
  };
};
