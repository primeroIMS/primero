import { UserAgentApplication } from "msal";

import { DOMAIN } from "../components/pages/login/idp-selection/config";

export const setMsalConfig = {
  auth: {
    clientId: window.IDP.providerClientId,
    authority: window.IDP.authorizationUrl,
    validateAuthority: false,
    redirectUri: `http://${DOMAIN}/login/${window.IDP.providerType}`
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true
  }
};

export const setMsalApp = msalConfig => {
  return new UserAgentApplication(msalConfig);
};
