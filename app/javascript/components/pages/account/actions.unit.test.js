import actions from "./actions";

describe("pages/account/actions.js", () => {
  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...actions };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "CLEAR_CURRENT_USER",
      "FETCH_CURRENT_USER",
      "FETCH_CURRENT_USER_STARTED",
      "FETCH_CURRENT_USER_SUCCESS",
      "FETCH_CURRENT_USER_FINISHED",
      "FETCH_CURRENT_USER_FAILURE",
      "UPDATE_CURRENT_USER",
      "UPDATE_CURRENT_USER_FAILURE",
      "UPDATE_CURRENT_USER_STARTED",
      "UPDATE_CURRENT_USER_SUCCESS"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(actions).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
