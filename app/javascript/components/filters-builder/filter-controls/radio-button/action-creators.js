import { SET_FILTERS, ADD_RADIO_BUTTON } from "../../actions";

export const setupRadioButtons = (payload, namespace) => {
  return {
    type: `${namespace}/${SET_FILTERS}`,
    payload
  };
};

export const setRadioButton = (payload, namespace) => {
  return {
    type: `${namespace}/${ADD_RADIO_BUTTON}`,
    payload
  };
};
