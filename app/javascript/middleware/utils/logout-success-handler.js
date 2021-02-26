import redirectTo from "./redirect-to";

export default store => {
  window.localStorage.clear();
  redirectTo(store, "/login");
};
