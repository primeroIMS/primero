/* eslint-disable import/prefer-default-export */

import { List } from "immutable";

export const selectListHeaders = (state, namespace) => state.getIn(["user", "listHeaders", namespace], List([]));

export const getDisableUsersLoading = state =>
  state.getIn(["records", "admin", "users", "disableUsers", "loading"], false);

export const getDisableUsersErrors = state =>
  state.getIn(["records", "admin", "users", "disableUsers", "errors"], false);

export const getSendEmailsLoading = state => state.getIn(["records", "users", "sendEmails", "loading"], false);

export const getSendEmailsErrors = state => state.getIn(["records", "users", "sendEmails", "errors"], false);
