import * as actions from "./actions";

describe("<Reports /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "FETCH_REPORT",
      "FETCH_REPORT_STARTED",
      "FETCH_REPORT_SUCCESS",
      "FETCH_REPORT_FAILURE",
      "FETCH_REPORT_FINISHED"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
