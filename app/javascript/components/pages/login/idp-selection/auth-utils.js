import { UserAgentApplication } from "msal";

import { DOMAIN, PROTOCOL } from "./config";

export const setMsalConfig = idp => {
  return {
    auth: {
      clientId: idp.get("client_id"),
      authority: idp.get("authorization_url"),
      validateAuthority: false,
      redirectUri: `${PROTOCOL}//${DOMAIN}/login/${idp.get("provider_type")}`
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true
    }
  };
};

export const setMsalApp = msalConfig => {
  return new UserAgentApplication(msalConfig);
};

export const getLoginRequest = (identityScope, uniqueId) => {
  return {
    scopes: identityScope,
    extraQueryParameters: { domain_hint: uniqueId }
  };
};

export const getTokenRequest = identityScope => {
  return {
    scopes: identityScope
  };
};
