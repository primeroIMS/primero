import NAMESPACE from "./namespace";

export const selectDrawerOpen = state =>
  state.getIn(["ui", NAMESPACE, "drawerOpen"], false);

export const selectUsername = state => state.getIn(["user", "username"], "");

export const selectUserAgency = state => {
  let agency = {};
  const userAgency = state.getIn(["user", "agency"], "");
  const agencies = state.getIn(["application", "agencies"], "");
  if (agencies) {
    agency = agencies.find(data => data.unique_id === userAgency, "");
    if (!agency) {
      return agencies[0];
    }
  }
  return agency;
};
