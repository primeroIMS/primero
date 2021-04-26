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
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  };
};

export const setMsalApp = msalConfig => {
  return new UserAgentApplication(msalConfig);
};

export const getLoginRequest = (identityScope, domainHint) => {
  return {
    scopes: identityScope,
    extraQueryParameters: { domain_hint: domainHint }
  };
};

export const getTokenRequest = identityScope => {
  return {
    scopes: identityScope
  };
};
