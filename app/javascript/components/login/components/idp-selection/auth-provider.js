// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable no-return-await */
import { InteractionRequiredAuthError } from "@azure/msal-common";
import { isImmutable } from "immutable";
import { get } from "lodash";

import { SELECTED_IDP } from "../../../user/constants";

import { setMsalApp, setMsalConfig, getLoginRequest, getTokenRequest } from "./utils";

let msalApp;
let forceStandardOIDC = false;
let tokenRequest;
let selectedIDPCache;

function selectedIDPFromSessionStore(key) {
  const selectedIDP = selectedIDPCache || JSON.parse(sessionStorage.getItem(SELECTED_IDP));

  selectedIDPCache = selectedIDP;

  if (key) {
    return get(selectedIDP, key);
  }

  return selectedIDP;
}
selectedIDPFromSessionStore();

async function getIDPToken() {
  try {
    if (tokenRequest) {
      const token = await msalApp.acquireTokenSilent(tokenRequest);

      return token.idToken;
    }

    return undefined;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      return await msalApp.acquireTokenPopup(tokenRequest).catch(popupError => {
        // eslint-disable-next-line no-console
        console.error(popupError);
      });
    }

    // eslint-disable-next-line no-console
    console.warn("Failed to acquire token", error);

    return undefined;
  }
}

const setupMsal = (idp, historyObj) => {
  const idpObj = (isImmutable(idp) ? idp.toJS() : idp) || selectedIDPFromSessionStore();

  const identityScope = idpObj.identity_scope || [""];
  const domainHint = idpObj.domain_hint;
  const loginRequest = getLoginRequest(identityScope, domainHint);

  tokenRequest = getTokenRequest(identityScope);

  if (!msalApp) {
    forceStandardOIDC = idpObj.force_standard_oidc === true;
    const msalConfig = setMsalConfig(idpObj, forceStandardOIDC);

    msalApp = setMsalApp(msalConfig, historyObj);
  }

  sessionStorage.setItem(SELECTED_IDP, JSON.stringify(idpObj));

  return { loginRequest };
};

if (selectedIDPCache && !msalApp) {
  setupMsal();
}

const handleResponse = async successCallback => {
  const tokenResponse = await getIDPToken(tokenRequest);

  if (tokenResponse) {
    successCallback();
  }
};

export const refreshIdpToken = async (idp, successCallback) => {
  handleResponse(successCallback);
};

export const signIn = async (idp, callback, historyObj) => {
  sessionStorage.clear();

  const { loginRequest } = setupMsal(idp, historyObj);

  try {
    const response = await msalApp.loginPopup(loginRequest);

    msalApp.setActiveAccount(response.account);
    callback(response.idToken);
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = () => {
  if (msalApp) {
    if (forceStandardOIDC) {
      // OIDC front-channel logout can take a post_logout_redirect_uri parameter, which we set in the msal config
      // However, if this parameter is included, either client_id or id_token_hint is required
      // https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
      msalApp.logoutPopup({
        authority: msalApp.config.auth.authority,
        mainWindowRedirectUri: `${msalApp.config.auth.authority}/protocol/openid-connect/logout`,
        extraQueryParameters: {
          client_id: msalApp.config.auth.clientId
        }
      });
    } else {
      msalApp.logout();
    }
    msalApp = null;
    forceStandardOIDC = false;
  }
};

export { getIDPToken };
