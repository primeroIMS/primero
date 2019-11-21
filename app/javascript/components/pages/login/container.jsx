import React from "react";

import { NAME } from "./config";
import IdpSelection from "./idp-selection";
import LoginForm from "./login-form";

const useIdentity = true; //this should be pulled from an ENV variable

const Container = () => {
  return (
    <>
      {useIdentity ? <IdpSelection /> : <LoginForm />}
    </>
  );
};

Container.displayName = NAME;

export default Container;
