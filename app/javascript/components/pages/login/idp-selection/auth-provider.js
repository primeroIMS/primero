import { UserAgentApplication } from "msal";

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
    scopes: idp.get("scope").toArray(),
    extraQueryParameters: {domain_hint: idp.get("domain_hint")}
  };

  const msalConfig = {
    auth: {
     clientId: idp.get("client_id"),
     authority: idp.get("authority"),
     validateAuthority: false,
     redirectUri: idp.get("redirect_uri")
    },
    cache: {
     cacheLocation: "localStorage",
     storeAuthStateInCookie: true
    }
  };

  const tokenRequest = {
    scopes: idp.get("scope").toArray()
  };

  msalApp = new UserAgentApplication(msalConfig);

  msalApp.loginPopup(loginRequest).then((loginResponse) => {
    getToken(tokenRequest).then(updateUI);
  }).catch((error) => {
    console.log(error);
  });
};

export const signOut = () => {
  msalApp.logout();
}
