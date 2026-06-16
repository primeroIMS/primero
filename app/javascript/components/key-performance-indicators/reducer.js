import { fromJS, Map } from "immutable";

import NAMESPACE from "./namespace";
import { KEY_PERFORMANCE_INDICATORS } from "./constants";

const DEFAULT_STATE = Map({});
const KPI_SUCCESS_EVENT = new RegExp(`${KEY_PERFORMANCE_INDICATORS}/([a-z_]*?)_SUCCESS`);

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  if (!type.startsWith(KEY_PERFORMANCE_INDICATORS)) return state;

  if (!type.endsWith("SUCCESS")) return state;

  const identifier = type.match(KPI_SUCCESS_EVENT)?.[1];

  if (identifier) {
    return state.set(identifier, fromJS(payload));
  }

  return state;
};

export default { [NAMESPACE]: reducer };
