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
      "FETCH_REPORTS",
      "FETCH_REPORTS_STARTED",
      "FETCH_REPORTS_SUCCESS",
      "FETCH_REPORTS_FINISHED",
      "FETCH_REPORTS_FAILURE",
      "CLEAR_METADATA"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(actions).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
