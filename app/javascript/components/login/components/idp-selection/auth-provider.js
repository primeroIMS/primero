import { InteractionRequiredAuthError } from "msal";
import { CryptoUtils } from "msal/lib-es6/utils/CryptoUtils";

import { SELECTED_IDP } from "../../../user/constants";

import { setMsalApp, setMsalConfig, getLoginRequest, getTokenRequest } from "./utils";

let msalApp;
let forceStandardOIDC = false;

const getToken = tokenRequest =>
  msalApp.acquireTokenSilent(tokenRequest).catch(error => {
    if (error instanceof InteractionRequiredAuthError) {
      return msalApp.acquireTokenPopup(tokenRequest);
    }

    // eslint-disable-next-line no-console
    console.warn("Failed to acquire token", error);

    return undefined;
  });

const setupMsal = idp => {
  const identityScope = idp.get("identity_scope")?.toJS() || [""];
  const domainHint = idp.get("domain_hint");
  const msalConfig = setMsalConfig(idp);
  const loginRequest = getLoginRequest(identityScope, domainHint);
  const tokenRequest = getTokenRequest(identityScope);

  if (!msalApp) {
    forceStandardOIDC = idp.get("force_standard_oidc") === true;
    msalApp = setMsalApp(msalConfig, forceStandardOIDC);
  }

  localStorage.setItem(SELECTED_IDP, idp.get("unique_id"));

  return { loginRequest, tokenRequest };
};

const handleResponse = async (tokenRequest, successCallback) => {
  const tokenResponse = await getToken(tokenRequest);

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
    if (forceStandardOIDC) {
      // OIDC front-channel logout can take a post_logout_redirect_uri parameter, which we set in the msal config
      // However, if this parameter is included, either client_id or id_token_hint is required
      // https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
      // Since MSAL does not offer any way to add parameters to logout, we piggyback on the correlationId argument
      // The GUID is what msal uses as the default when the argument is not specified
      msalApp.logout(`${CryptoUtils.createNewGuid()}&client_id=${encodeURIComponent(msalApp.config.auth.clientId)}`);
    } else {
      msalApp.logout();
    }
    msalApp = null;
    forceStandardOIDC = false;
  }
};
