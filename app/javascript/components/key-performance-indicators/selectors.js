import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export default (identifier, state, _default) => {
  return state.getIn(["records", NAMESPACE, identifier], fromJS(_default));
};
