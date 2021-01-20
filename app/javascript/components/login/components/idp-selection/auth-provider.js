import { setMsalApp, setMsalConfig, getLoginRequest, getTokenRequest } from "./utils";

let msalApp;

const getToken = tokenRequest => {
  return msalApp.acquireTokenSilent(tokenRequest).catch(() => {
    return msalApp.acquireTokenPopup(tokenRequest);
  });
};

const deleteCookie = name => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const signIn = async (idp, tokenCallback) => {
  const identityScope = idp.get("identity_scope")?.toJS() || [""];
  const domainHint = idp.get("domain_hint");
  const msalConfig = setMsalConfig(idp);

  msalApp = setMsalApp(msalConfig);

  const loginRequest = getLoginRequest(identityScope, domainHint);
  const tokenRequest = getTokenRequest(identityScope);

  const loginResponse = await msalApp.loginPopup(loginRequest);

  if (loginResponse) {
    const tokenResponse = await getToken(tokenRequest).catch(error => {
      // eslint-disable-next-line no-console
      console.warn(error);
    });

    if (tokenResponse) {
      tokenCallback();
    }
  }
};

export const signOut = () => {
  if (msalApp) {
    deleteCookie("primero_user_name");
    deleteCookie("primero_user_id");
    localStorage.removeItem("user");
    msalApp.logout();
  }
};
