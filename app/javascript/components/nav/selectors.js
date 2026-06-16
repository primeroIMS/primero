import { Map, fromJS } from "immutable";

import NAMESPACE from "./namespace";

const getUser = state => state.get("user", fromJS({}));

export const selectUsername = state => getUser(state).get("username", "");

export const getUserId = state => getUser(state).get("id", "");

export const selectUserAgency = state =>
  state
    .getIn(["application", "agencies"], Map({}))
    .filter(a => {
      const userAgency = state.getIn(["user", "agency"], null);

      return userAgency ? a.get("unique_id") === userAgency : true;
    })
    .first();

export const selectAlerts = state => {
  return state.getIn(["ui", NAMESPACE, "alerts", "data"], Map({}));
};
