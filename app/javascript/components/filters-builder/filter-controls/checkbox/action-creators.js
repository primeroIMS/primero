import { ADD_CHECKBOX, DELETE_CHECKBOX, SET_FILTERS } from "../../actions";

export const setUpCheckBoxes = (payload, namespace) => {
  return {
    type: `${namespace}/${SET_FILTERS}`,
    payload
  };
};

export const setCheckBox = (payload, namespace) => {
  return {
    type: payload.included
      ? `${namespace}/${DELETE_CHECKBOX}`
      : `${namespace}/${ADD_CHECKBOX}`,
    payload
  };
};
