import * as Msal from "msal";

let msalApp;

const getToken = (tokenRequest) => {
  return msalApp.acquireTokenSilent(tokenRequest).catch((error) => {
    return msalApp.acquireTokenPopup(tokenrequest).then((tokenResponse) => {
    })
  });
};

const updateUI = () => {
  const userName = msalApp.getAccount().name;
};

export const signIn = (idp) => {
  const loginRequest = {
    scopes: idp.scope,
    extraQueryParameters: {domain_hint: idp.domain_hint}
  };

  const msalConfig = {
    auth: {
     clientId: idp.client_id,
     authority: idp.authority,
     validateAuthority: false,
     redirectUri: "http://localhost:3000/v2/login/b2c"
    },
    cache: {
     cacheLocation: "localStorage",
     storeAuthStateInCookie: true
    }
  };

  const tokenRequest = {
    scopes: idp.scope
  };

  msalApp = new Msal.UserAgentApplication(msalConfig);

  msalApp.loginPopup(loginRequest).then((loginResponse) => {
    console.log('got to loginResponse');
    getToken(tokenRequest).then(updateUI);
  }).catch((error) => {
    console.log(error);
  });
};

export const signOut = () => {
  msalApp.logout();
}
