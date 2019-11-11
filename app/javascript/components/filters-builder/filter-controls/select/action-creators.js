import { SET_FILTERS, ADD_SELECT_RANGE, ADD_SELECT } from "../../actions";

export const setupSelect = (payload, namespace) => {
  return {
    type: `${namespace}/${SET_FILTERS}`,
    payload
  };
};

export const setSelectValue = (payload, namespace) => {
  return {
    type: payload.isDate
      ? `${namespace}/${ADD_SELECT_RANGE}`
      : `${namespace}/${ADD_SELECT}`,
    payload
  };
};
