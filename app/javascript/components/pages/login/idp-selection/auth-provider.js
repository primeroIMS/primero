import { UserAgentApplication } from "msal";
import { DOMAIN } from "./config";

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

export const signIn = async (idp) => {
  localStorage.setItem("provider_id", idp.get("unique_id"));
  const loginRequest = {
    scopes: idp.get("identity_scope").toArray(),
    extraQueryParameters: {domain_hint: idp.get("unique_id")}
  };

  const redirectUri = `http://${DOMAIN}/login/${idp.get("provider_type")}`;

  const msalConfig = {
    auth: {
      clientId: idp.get("client_id"),
      authority: idp.get("authorization_url"),
      validateAuthority: false,
      redirectUri: redirectUri
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

  const loginResponse = await msalApp.loginPopup(loginRequest);
  if (loginResponse) {
    const tokenResponse = await getToken(tokenRequest)
      .catch(error => {
        console.log(error);
      });

    if (tokenResponse) {
      updateUI();
    }
  }
};

export const signOut = () => {
  msalApp.logout();
}
