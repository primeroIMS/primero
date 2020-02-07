import { fromJS } from "immutable";

import { LOGIN_SUCCESS } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case LOGIN_SUCCESS:
      return state
        .set(
          "use_identity_provider",
          fromJS(payload?.metadata?.use_identity_provider)
        )
        .set("identity_providers", fromJS(payload.data));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
