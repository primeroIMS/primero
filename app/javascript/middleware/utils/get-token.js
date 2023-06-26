const getToken = () => {
  return localStorage.getItem("cachedIdToken");
};

export default getToken;
