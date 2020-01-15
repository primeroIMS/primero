import React from "react";
import { useSelector } from "react-redux";

import { NAME } from "./config";
import IdpSelection from "./idp-selection";
import LoginForm from "./login-form";
import { selectUseIdentityProvider } from "./selectors";

const Container = () => {
  const useIdentity = useSelector(state => selectUseIdentityProvider(state));

  return (
    <>
      {useIdentity ? <IdpSelection /> : <LoginForm />}
    </>
  );
};

Container.displayName = NAME;

export default Container;
