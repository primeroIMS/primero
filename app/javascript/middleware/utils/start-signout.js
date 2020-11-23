export default (store, attemptSignout, msalSignout) => {
  const usingIdp = store.getState().getIn(["idp", "use_identity_provider"]);
  const pendingUserLogin = store.getState().getIn(["connectivity", "pendingUserLogin"], false);

  if (pendingUserLogin) return;

  if (usingIdp) {
    msalSignout();
  } else {
    store.dispatch(attemptSignout());
  }
};
