// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

// eslint-disable-next-line import/prefer-default-export
export const getUserGroups = state => state.getIn(["records", "user_groups", "data"], fromJS([]));
