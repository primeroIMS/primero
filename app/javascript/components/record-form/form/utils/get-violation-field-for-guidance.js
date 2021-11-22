import { SEPERATOR } from "../../constants";

export default fields => {
  if (fields[0].type === SEPERATOR) {
    return fields[0];
  }

  return {};
};
