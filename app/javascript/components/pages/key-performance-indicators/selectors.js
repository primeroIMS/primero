import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const numberOfCases = state => {
  return state.getIn(["records", NAMESPACE, 'numberOfCases'], fromJS({
    data: []
  }));
};

export const reportingDelay = state => {
  return state.getIn(["records", NAMESPACE, 'reportingDelay'], fromJS({
    data: []
  }));
};
