import { CUSTOM_STRINGS_SOURCE } from "../constants";

const apiEndpoints = [CUSTOM_STRINGS_SOURCE.agency, CUSTOM_STRINGS_SOURCE.user];

function apiSelectOffline(online, option) {
  return !online && apiEndpoints.includes(option);
}

export default apiSelectOffline;
