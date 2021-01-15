import { clearDialog } from "../../components/action-dialog";
import { setPendingUserLogin } from "../../components/connectivity/action-creators";
import DB from "../../db";
import { setAuthenticatedUser } from "../../components/user";

import handleReturnUrl from "./handle-return-url";

export default async (store, user) => {
  const { user_name: username, id } = user;
  const pendingUserLogin = store.getState().getIn(["connectivity", "pendingUserLogin"], false);
  const userFromDB = await DB.getRecord("user", username);

  if (!userFromDB) {
    await DB.clearDB();
  }

  localStorage.setItem("user", JSON.stringify({ username, id }));
  store.dispatch(setAuthenticatedUser({ username, id }));

  if (!pendingUserLogin) {
    handleReturnUrl(store);
  }

  store.dispatch(clearDialog());
  store.dispatch(setAuthenticatedUser({ username, id }));
  store.dispatch(setPendingUserLogin(false));
};
