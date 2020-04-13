/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const selectPotentialMatches = state => {
  return state.getIn(["records", NAMESPACE, "potentialMatches"], fromJS({}));
};
