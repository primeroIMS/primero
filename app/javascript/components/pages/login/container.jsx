import React from "react";
import { useSelector } from "react-redux";

import { NAME } from "./config";
import IdpSelection from "./idp-selection";
import LoginForm from "./login-form";
import { selectUseIdentityProvider } from "./selectors";

const Container = () => {
  const useIdentity = useSelector(state => selectUseIdentityProvider(state));
  let identityForm = "";

  if (typeof useIdentity !== "undefined") {
    identityForm = useIdentity ? <IdpSelection /> : <LoginForm />;
  }

  return <>{identityForm}</>;
};

Container.displayName = NAME;

export default Container;
