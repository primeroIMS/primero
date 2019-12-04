import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const numberOfCases = state => {
  return state.getIn(["records", NAMESPACE, 'numberOfCases'], fromJS({
    dates: [],
    data: []
  }));
};

export const numberOfIncidents = state => {
  return state.getIn(["records", NAMESPACE, 'numberOfIncidents'], fromJS({
    data: []
  }));
};

export const reportingDelay = state => {
  return state.getIn(["records", NAMESPACE, 'reportingDelay'], fromJS({
    data: []
  }));
};
