// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ProtocolMode, PublicClientApplication } from "@azure/msal-browser";

import CustomNavigationClient from "./custom-navigation-client";

export const setMsalConfig = (idp = {}, forceStandardOidc) => {
  if (forceStandardOidc) {
    return {
      auth: {
        protocolMode: ProtocolMode.OIDC,
        clientId: idp.client_id,
        authority: idp.authorization_url,
        autoRefreshToken: true,
        authorityMetadata: JSON.stringify({
          authorization_endpoint: `${idp.authorization_url}/protocol/openid-connect/auth`,
          token_endpoint: `${idp.authorization_url}/protocol/openid-connect/token`,
          end_session_endpoint: `${idp.authorization_url}/protocol/openid-connect/logout`,
          issuer: idp.authorization_url
        }),
        knownAuthorities: ["unicefpartners.b2clogin.com", idp.authorization_url],
        validateAuthority: false,
        redirectUri: idp.redirect_uri
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
      }
    };
  }

  return {
    auth: {
      clientId: idp.client_id,
      authority: idp.authorization_url,
      knownAuthorities: ["unicefpartners.b2clogin.com"],
      validateAuthority: false,
      redirectUri: idp.redirect_uri
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false
    }
  };
};

export const setMsalApp = (msalConfig, historyObj) => {
  const app = new PublicClientApplication(msalConfig);
  const navigationClient = new CustomNavigationClient(historyObj);

  app.setNavigationClient(navigationClient);

  return app;
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
