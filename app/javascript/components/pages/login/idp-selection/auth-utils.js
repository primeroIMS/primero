import { UserAgentApplication } from "msal";

import { DOMAIN } from "./config";

export const setMsalConfig = (idp) => {
  return {
    auth: {
      clientId: idp.get("client_id"),
      authority: idp.get("authorization_url"),
      validateAuthority: false,
      redirectUri: `http://${DOMAIN}/login/${idp.get("provider_type")}`
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  };
};

export const setMsalApp = (msalConfig) => {
  return new UserAgentApplication(msalConfig);
};

export const getLoginRequest = (identity_scope, unique_id) => {
  return {
    scopes: identity_scope,
    extraQueryParameters: {domain_hint: unique_id}
  };
};

export const getTokenRequest = (identity_scope) => {
  return {
    scopes: identity_scope
  };
};