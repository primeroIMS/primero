import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const numberOfCases = state => {
  return state.getIn(["records", NAMESPACE, 'numberOfCases'], fromJS({
    columns: ["REPORTING SITE", "SEP 2019", "AUG 2019", "JUL 2019"],
    data: []
  }));
};
