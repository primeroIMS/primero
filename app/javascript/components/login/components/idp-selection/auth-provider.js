import { InteractionRequiredAuthError } from "msal/lib-commonjs/error/InteractionRequiredAuthError";

import { SELECTED_IDP } from "../../../user/constants";

import { setMsalApp, setMsalConfig, getLoginRequest, getTokenRequest } from "./utils";

let msalApp;

const getToken = tokenRequest => {
  // eslint-disable-next-line consistent-return
  return msalApp.acquireTokenSilent(tokenRequest).catch(error => {
    if (error instanceof InteractionRequiredAuthError) {
      msalApp.acquireTokenPopup(tokenRequest);
    }
  });
};

const setupMsal = idp => {
  const identityScope = idp.get("identity_scope")?.toJS() || [""];
  const domainHint = idp.get("domain_hint");
  const msalConfig = setMsalConfig(idp);
  const loginRequest = getLoginRequest(identityScope, domainHint);
  const tokenRequest = getTokenRequest(identityScope);

  if (!msalApp) {
    msalApp = setMsalApp(msalConfig);
  }

  localStorage.setItem(SELECTED_IDP, idp.get("unique_id"));

  return { loginRequest, tokenRequest };
};

const handleResponse = async (tokenRequest, successCallback) => {
  const tokenResponse = await getToken(tokenRequest).catch(error => {
    // eslint-disable-next-line no-console
    console.warn(error);
  });

  if (tokenResponse) {
    successCallback();
  }
};

export const refreshIdpToken = async (idp, successCallback) => {
  const { tokenRequest } = setupMsal(idp);

  handleResponse(tokenRequest, successCallback);
};

export const signIn = async (idp, successCallback) => {
  const { loginRequest, tokenRequest } = setupMsal(idp);
  const loginResponse = await msalApp.loginPopup(loginRequest);

  if (loginResponse) {
    handleResponse(tokenRequest, successCallback);
  }
};

export const signOut = () => {
  if (msalApp) {
    msalApp.logout();
    msalApp = null;
  }
};
