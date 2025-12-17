// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { List } from "immutable";

export const selectListHeaders = (state, namespace) => state.getIn(["user", "listHeaders", namespace], List([]));

export const getDisableUsersLoading = state =>
  state.getIn(["records", "admin", "users", "disableUsers", "loading"], false);

export const getDisableUsersErrors = state =>
  state.getIn(["records", "admin", "users", "disableUsers", "errors"], false);
