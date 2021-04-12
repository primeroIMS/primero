/* eslint-disable import/prefer-default-export */
import { DATABASE_NAME } from "../../config";
import { selectUserModules } from "../application/selectors";

export const getModuleLogoID = state => {
  const userModules = selectUserModules(state);

  // eslint-disable-next-line camelcase
  return userModules.size === 1 ? userModules?.first()?.unique_id : DATABASE_NAME;
};
