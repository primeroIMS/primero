import NAMESPACE from "../namespace";

export const selectIdentityProviders = state =>
  state.getIn([NAMESPACE, "identity_providers"]);
