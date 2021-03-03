import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getUseIdentityProvider = state => state.getIn([NAMESPACE, "use_identity_provider"], false);

export const getSelectedIDP = (state, id) =>
  state.getIn([NAMESPACE, "identity_providers"], fromJS([])).find(provider => provider.get("unique_id") === id);

export const getLoading = state => state.getIn([NAMESPACE, "loading"], false);
