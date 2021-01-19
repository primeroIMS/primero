import redirectTo from "./redirect-to";

export default store => {
  localStorage.removeItem("user");
  redirectTo(store, "/login");
};
