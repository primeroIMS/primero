// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getUseIdentityProvider = state => state.getIn([NAMESPACE, "use_identity_provider"], false);

export const getSelectedIDP = (state, id) =>
  state
    .getIn([NAMESPACE, "identity_providers"], fromJS([]))
    .find(provider => provider.get("unique_id") === id, fromJS({}));

export const getLoading = state => state.getIn([NAMESPACE, "loading"], false);
