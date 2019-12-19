import {
  setMsalApp,
  setMsalConfig,
  getLoginRequest,
  getTokenRequest
} from "./auth-utils";

let msalApp;

const getToken = (tokenRequest) => {
  return msalApp.acquireTokenSilent(tokenRequest).catch((error) => {
    return msalApp.acquireTokenPopup(tokenrequest).then((tokenResponse) => {
    })
  });
};

const updateUI = () => {
  const userName = msalApp.getAccount().name;
  console.log('userName', msalApp.getAccount(), msalApp.getAccount().name)
  const login = document.getElementsByClassName("loginSelection")[0];
  const logout = document.getElementsByClassName("logoutSelection")[0];
  login.style.display = "none";
  logout.style.display = "block";
};

export const signIn = async (idp) => {
  const msalConfig = setMsalConfig(idp);
  msalApp = setMsalApp(msalConfig);
  const unique_id = idp.get("unique_id");

  localStorage.setItem("provider_id", unique_id);

  const loginRequest = getLoginRequest(idp);
  const tokenRequest = getTokenRequest(idp);

  const loginResponse = await msalApp.loginPopup(loginRequest);
  if (loginResponse) {
    const tokenResponse = await getToken(tokenRequest)
      .catch(error => {
        console.log(error);
      });

    if (tokenResponse) {
      console.log('tokenResponse', tokenResponse);
      updateUI();
    }
  }
};

export const signOut = () => {
  msalApp.logout();
}
