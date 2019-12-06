import * as Msal from "msal";

let msalApp;

// function getToken(accessTokenRequest) {
//   // return msalApp.acquireTokenSilent(tokenRequest).catch(function(error) {
//   //   console.log("aquire token popup");
//   //   // fallback to interaction when silent call fails
//   //   return msalApp.acquireTokenPopup(tokenrequest).then(function (tokenResponse) {
//   //   }).catch(function(error){
//   //     console.log("Failed token acquisition", error);
//   //   });
//   // });

//   return msalApp.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
//     let accessToken = accessTokenResponse.accessToken;
//     return accessTokenResponse;
//   }).catch((error) => {
//     if (error.errorMessage.indexOf("interaction_required") !== -1) {
//       msalApp.acquireTokenPopup(accessTokenRequest).then((accessTokenResponse) => {
//         return accessTokenResponse;
//       }).catch((error) => {
//         console.log(error);
//       });
//     }
//     console.log(error);
//   });
// }

const getToken = (tokenRequest) => {
  return msalApp.acquireTokenSilent(tokenRequest).catch((error) => {
    return msalApp.acquireTokenPopup(tokenrequest).then((tokenResponse) => {
    })
  });
};

// const callApiWithAccessToken = (accessToken) => {
//   $.ajax({
//     type: "GET",
//     url: appConfig.webApi,
//     headers: {
//      'Authorization': 'Bearer ' + accessToken
//     }
//   }).done((data) => {
//     logMessage("Web APi returned:\n" + JSON.stringify(data));
//   }).fail((jqXHR, textStatus) => {
//     logMessage("Error calling the Web api:\n" + textStatus);
//   })
// }

const updateUI = () => {
  const userName = msalApp.getAccount().name;
  console.log('userName:', userName);
  console.log(msalApp.getAccount());
  // logMessage("User '" + userName + "' logged-in");
  // const authButton = document.getElementById('auth');
  // authButton.innerHTML = 'logout';
  // authButton.setAttribute('onclick', 'logout();');
  // greet the user - specifying login
  // const label = document.getElementById('label');
  // label.innerText = "Hello " + userName;
  // add the callWebApi button
  // const callWebApiButton = document.getElementById('callApiButton');
  // callWebApiButton.setAttribute('class', 'visible');
};

// const callApi = () => {
//   // console.log('here is where backend api is called and passed token');
//   getToken(tokenRequest).then(function(tokenResponse) {
//     callApiWithAccessToken(tokenResponse.accessToken);
//   });
// }

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
