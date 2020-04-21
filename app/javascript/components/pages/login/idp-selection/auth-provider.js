import {
  setMsalApp,
  setMsalConfig,
  getLoginRequest,
  getTokenRequest
} from "./auth-utils";

let msalApp;

const getToken = tokenRequest => {
  return msalApp.acquireTokenSilent(tokenRequest).catch(() => {
    return msalApp.acquireTokenPopup(tokenRequest);
  });
};

export const signIn = async (idp, tokenCallback) => {
  const identityScope = idp.get("identity_scope").toJS();
  const uniqueId = idp.get("unique_id");

  const msalConfig = setMsalConfig(idp);

  msalApp = setMsalApp(msalConfig);

  localStorage.setItem("provider_id", uniqueId);

  const loginRequest = getLoginRequest(identityScope, uniqueId);
  const tokenRequest = getTokenRequest(identityScope);

  const loginResponse = await msalApp.loginPopup(loginRequest);

  if (loginResponse) {
    const tokenResponse = await getToken(tokenRequest).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
    });

    if (tokenResponse) {
      tokenCallback();
    }
  }
};

export const signOut = () => {
  if (msalApp) {
    msalApp.logout();
  }
};
