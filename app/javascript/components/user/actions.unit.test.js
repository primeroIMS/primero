import Actions from "./actions";

describe("User - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...Actions };

    [
      "FETCH_USER_DATA",
      "FETCH_USER_DATA_SUCCESS",
      "LOGOUT",
      "LOGOUT_FAILURE",
      "LOGOUT_FINISHED",
      "LOGOUT_STARTED",
      "LOGOUT_SUCCESS",
      "LOGOUT_SUCCESS_CALLBACK",
      "REFRESH_USER_TOKEN",
      "RESET_PASSWORD",
      "RESET_PASSWORD_FAILURE",
      "RESET_PASSWORD_STARTED",
      "RESET_PASSWORD_SUCCESS",
      "SET_AUTHENTICATED_USER"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
