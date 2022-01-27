import * as actions from "./actions";

describe("<Reports /> - Actions", () => {
  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...actions };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "FETCH_INSIGHTS",
      "FETCH_INSIGHTS_STARTED",
      "FETCH_INSIGHTS_SUCCESS",
      "FETCH_INSIGHTS_FINISHED",
      "FETCH_INSIGHTS_FAILURE",
      "CLEAR_METADATA"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(actions).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
