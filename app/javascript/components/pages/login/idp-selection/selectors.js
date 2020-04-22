/* eslint-disable import/prefer-default-export */

import NAMESPACE from "../namespace";

export const getIdentityProviders = state =>
  state.getIn([NAMESPACE, "identity_providers"]);
