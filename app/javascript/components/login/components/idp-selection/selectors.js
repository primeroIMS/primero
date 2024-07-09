// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import NAMESPACE from "../../namespace";

export const getIdentityProviders = state => state.getIn([NAMESPACE, "identity_providers"], fromJS([]));
