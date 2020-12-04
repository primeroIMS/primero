/* eslint-disable import/prefer-default-export */

import NAMESPACE from "./namespace";

export const getUseIdentityProvider = state => state.getIn([NAMESPACE, "use_identity_provider"], false);

export const getLoading = state => state.getIn([NAMESPACE, "loading"], false);
