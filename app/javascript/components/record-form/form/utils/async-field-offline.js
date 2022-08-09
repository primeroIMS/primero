import { ASYNC_OPTIONS } from "../constants";

function asyncFieldOffline(online, option) {
  if (!online && ASYNC_OPTIONS.includes(option)) {
    return true;
  }

  return false;
}

export default asyncFieldOffline;
