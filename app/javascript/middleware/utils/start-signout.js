export default (store, attemptSignout, msalSignout) => {
  const usingIdp = store.getState().getIn(["idp", "use_identity_provider"]);

  if (usingIdp) {
    msalSignout();
  } else {
    store.dispatch(attemptSignout());
  }
};
