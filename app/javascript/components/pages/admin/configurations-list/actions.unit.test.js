import actions from "./actions";

describe("configurations-list/actions.js", () => {
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
      "CLEAR_METADATA",
      "FETCH_CONFIGURATIONS",
      "FETCH_CONFIGURATIONS_STARTED",
      "FETCH_CONFIGURATIONS_SUCCESS",
      "FETCH_CONFIGURATIONS_FAILURE",
      "FETCH_CONFIGURATIONS_FINISHED"
    ].forEach(property => {
      it(`exports '${property}' action`, () => {
        expect(actions).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
