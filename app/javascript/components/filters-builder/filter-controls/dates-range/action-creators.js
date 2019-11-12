import { SET_FILTERS, ADD_DATES_RANGE } from "../../actions";

export const setupDatesRange = (payload, namespace) => {
  return {
    type: `${namespace}/${SET_FILTERS}`,
    payload
  };
};

export const setDate = (payload, namespace) => {
  return {
    type: `${namespace}/${ADD_DATES_RANGE}`,
    payload
  };
};
