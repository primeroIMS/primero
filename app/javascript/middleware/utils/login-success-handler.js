// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { clearDialog } from "../../components/action-dialog";
import { setPendingUserLogin } from "../../components/connectivity/action-creators";
import DB from "../../db";
import { setAuthenticatedUser } from "../../components/user";

import handleReturnUrl from "./handle-return-url";

export default async (store, user = {}) => {
  const { user_name: username, id, group_permission: groupPermission } = user;
  const formattedUser = { username, id, groupPermission };
  const pendingUserLogin = store.getState().getIn(["connectivity", "pendingUserLogin"], false);
  const userFromDB = await DB.getRecord("user", username);

  if (!userFromDB) {
    await DB.clearDB();
  }

  if (!pendingUserLogin) {
    localStorage.setItem("user", JSON.stringify(formattedUser));
  }

  store.dispatch(setAuthenticatedUser(formattedUser));

  if (!pendingUserLogin) {
    handleReturnUrl(store);
  }

  store.dispatch(clearDialog());
  store.dispatch(setPendingUserLogin(false));
};
