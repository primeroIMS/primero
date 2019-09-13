import { Map } from "immutable";
import NAMESPACE from "./namespace";

export const selectAgencies = state => state.getIn([NAMESPACE, "agencies"], []);

export const selectModules = state => state.getIn([NAMESPACE, "modules"], []);

export const selectLocales = state => state.getIn([NAMESPACE, "locales"], []);

export const selectUserModules = state =>
  state.getIn([NAMESPACE, "modules"], Map({})).filter(m => {
    const userModules = state.getIn(["user", "modules"], null);
    return userModules ? userModules.includes(m.unique_id) : false;
  });

export const selectUserIdle = state =>
  state.getIn([NAMESPACE, "userIdle"], false);
