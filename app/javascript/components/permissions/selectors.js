// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";
import { memoize } from "proxy-memoize";

export const getPermissionsByRecord = memoize(([state, recordType]) => {
  const permissions = state.getIn(["user", "permissions"], fromJS({}));

  return permissions.getIn([recordType], fromJS([]));
});
