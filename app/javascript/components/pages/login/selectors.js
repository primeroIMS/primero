/* eslint-disable import/prefer-default-export */

import NAMESPACE from "./namespace";

export const selectUseIdentityProvider = state =>
  state.getIn([NAMESPACE, "use_identity_provider"]);
