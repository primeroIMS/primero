const getToken = () => {
  const msalInstance = window.msal;

  return msalInstance?.getCachedIdToken(msalInstance, msalInstance?.account)?.rawIdToken;
};

export default getToken;
