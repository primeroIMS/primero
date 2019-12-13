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
  const login = document.getElementsByClassName("loginSelection")[0];
  const logout = document.getElementsByClassName("logoutSelection")[0];
  login.style.display = "none";
  logout.style.display = "block";
};

export const signIn = (idp) => {
  const loginRequest = {
    scopes: idp.get("identity_scope").toArray(),
    extraQueryParameters: {domain_hint: idp.get("unique_id")}
  };
  console.log('window.location.origin:::', window.location.origin);

  const msalConfig = {
    auth: {
      clientId: idp.get("client_id"),
      authority: idp.get("authorization_url"),
      validateAuthority: false,
      redirectUri: `http://localhost:3000/v2/login/${idp.get("provider_type")}`
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  };

  const tokenRequest = {
    scopes: idp.get("identity_scope").toArray()
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
