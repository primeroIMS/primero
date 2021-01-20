import actions from "./actions";

describe("configurations-form/actions.js", () => {
  it("exports an object", () => {
    expect(actions).to.be.an("object");
  });

  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...actions };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "APPLY_CONFIGURATION",
      "APPLY_CONFIGURATION_STARTED",
      "APPLY_CONFIGURATION_SUCCESS",
      "APPLY_CONFIGURATION_FINISHED",
      "APPLY_CONFIGURATION_FAILURE",
      "CHECK_CONFIGURATION",
      "CHECK_CONFIGURATION_STARTED",
      "CHECK_CONFIGURATION_SUCCESS",
      "CHECK_CONFIGURATION_FINISHED",
      "CHECK_CONFIGURATION_FAILURE",
      "CLEAR_SELECTED_CONFIGURATION",
      "DELETE_CONFIGURATION",
      "FETCH_CONFIGURATION",
      "FETCH_CONFIGURATION_STARTED",
      "FETCH_CONFIGURATION_SUCCESS",
      "FETCH_CONFIGURATION_FINISHED",
      "FETCH_CONFIGURATION_FAILURE",
      "SAVE_CONFIGURATION",
      "SAVE_CONFIGURATION_STARTED",
      "SAVE_CONFIGURATION_FINISHED",
      "SAVE_CONFIGURATION_SUCCESS",
      "SAVE_CONFIGURATION_FAILURE",
      "SEND_TO_PRODUCTION",
      "SEND_TO_PRODUCTION_STARTED",
      "SEND_TO_PRODUCTION_FINISHED",
      "SEND_TO_PRODUCTION_SUCCESS",
      "SEND_TO_PRODUCTION_FAILURE"
    ].forEach(property => {
      it(`exports '${property}' action`, () => {
        expect(actions).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
