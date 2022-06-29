import { ASYNC_OPTIONS } from "../constants";

function isFieldRequired(online, option, required) {
  if (!online && ASYNC_OPTIONS.includes(option) && required) {
    return false;
  }

  return required;
}

export default isFieldRequired;
