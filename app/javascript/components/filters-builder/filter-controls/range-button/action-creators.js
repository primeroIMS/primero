import { SET_FILTERS, ADD_RANGE_BUTTON } from "../../actions";

export const setupRangeButton = (payload, namespace) => {
  return {
    type: `${namespace}/${SET_FILTERS}`,
    payload
  };
};

export const setValue = (payload, namespace) => {
  return {
    type: `${namespace}/${ADD_RANGE_BUTTON}`,
    payload
  };
};
