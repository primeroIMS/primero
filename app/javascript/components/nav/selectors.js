import { Map } from "immutable";

import NAMESPACE from "./namespace";

export const selectUsername = state => state.getIn(["user", "username"], "");

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
