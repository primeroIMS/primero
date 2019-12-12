import { fromJS } from "immutable";

import { LOGIN } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return state
        .set("default_locale", fromJS(payload.default_locale))
        .set("locales", fromJS(payload.locales))
        .set("agency_icons", fromJS(payload.agency_icons))
        .set("branding", fromJS(payload.branding))
        .set("use_identity_provider", fromJS(payload.use_identity_provider))
        .set("identity_providers", fromJS(payload.identity_providers));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
