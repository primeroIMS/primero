import { Configuration, UserAgentApplication } from "msal";

import { DOMAIN } from "../components/login/components/idp-selection/config";

const idp = (window as any).IDP

export const setMsalConfig = {
  auth: {
    clientId: idp.providerClientId,
    authority: idp.authorizationUrl,
    validateAuthority: false,
    redirectUri: `http://${DOMAIN}/login/${idp.providerType}`
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};

export const setMsalApp = (msalConfig: Configuration) => {
  return new UserAgentApplication(msalConfig);
};
