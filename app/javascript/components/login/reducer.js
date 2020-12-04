import { fromJS } from "immutable";

import actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({ loading: false });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.LOGIN_STARTED:
      return state.set("loading", true);
    case actions.LOGIN_FINISHED:
    case actions.LOGIN_FAILURE:
      return state.set("loading", false);
    case actions.LOGIN_SUCCESS:
      return state
        .set(
          "use_identity_provider",
          // eslint-disable-next-line camelcase
          fromJS(payload?.metadata?.use_identity_provider)
        )
        .set("identity_providers", fromJS(payload?.data));
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
