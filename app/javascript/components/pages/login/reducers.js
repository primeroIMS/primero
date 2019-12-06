import { fromJS } from "immutable";

import { LOGIN } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return state
        .set("default_locale", payload.default_locale)
        .set("locales", payload.locales)
        .set("agency_icons", payload.agency_icons)
        .set("branding", payload.branding)
        .set("use_identity_provider", payload.use_identity_provider)
        .set("identity_providers", payload.identity_providers);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
