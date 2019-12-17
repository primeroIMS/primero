import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { UserAgentApplication } from "msal";
import { fromJS } from "immutable";

import { NAME } from "./config";
import IdpSelection from "./idp-selection";
import LoginForm from "./login-form";
import { selectUseIdentityProvider } from "./selectors";
import { selectIdentityProviders } from "./idp-selection/selectors";

const Container = ({ match }) => {
  const { params } = match;
  const useIdentity = useSelector(state => selectUseIdentityProvider(state));
  let msalApp;
  const provider_id = localStorage.getItem('provider_id') || '';
  if (params.provider && provider_id) {

    const identityProviders = useSelector(state => selectIdentityProviders(state));
    const provider = identityProviders ? identityProviders.find(provider => {
      return provider.get("unique_id") === provider_id;
    }) : fromJS({});

    const msalConfig = {
      auth: {
       clientId: provider.get("client_id"),
       authority: provider.get("authorization_url"),
       validateAuthority: false
      },
      cache: {
       cacheLocation: "localStorage",
       storeAuthStateInCookie: true
      }
    };
    msalApp = new UserAgentApplication(msalConfig);
  } else {
    return (
      <>
        {useIdentity ? <IdpSelection /> : <LoginForm />}
      </>
    );
  }
};

Container.displayName = NAME;

Container.propTypes = {
  match: PropTypes.object
};

export default withRouter(Container);
