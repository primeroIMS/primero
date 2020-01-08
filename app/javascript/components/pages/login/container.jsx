import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

import { NAME } from "./config";
import IdpSelection from "./idp-selection";
import LoginForm from "./login-form";
import { selectUseIdentityProvider } from "./selectors";
import { selectIdentityProviders } from "./idp-selection/selectors";

const Container = () => {
  const useIdentity = useSelector(state => selectUseIdentityProvider(state));
  let msalApp;
    return (
      <>
        {useIdentity ? <IdpSelection /> : <LoginForm />}
      </>
    );
};

Container.displayName = NAME;

export default withRouter(Container);
