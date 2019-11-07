import { SET_FILTERS, DELETE_CHIP, ADD_CHIP } from "../../actions";

export const setUpChips = (payload, namespace) => {
  return {
    type: `${namespace}/${SET_FILTERS}`,
    payload
  };
};

export const setChip = (payload, included, namespace) => {
  return {
    type: included ? `${namespace}/${DELETE_CHIP}` : `${namespace}/${ADD_CHIP}`,
    payload
  };
};
