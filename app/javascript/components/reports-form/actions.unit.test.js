import actions from "./actions";

describe("<ReportsForm /> - actions", () => {
  it("should have known actions", () => {
    const clone = { ...actions };

    [
      "SAVE_REPORT",
      "SAVE_REPORT_FAILURE",
      "SAVE_REPORT_FINISHED",
      "SAVE_REPORT_STARTED",
      "SAVE_REPORT_SUCCESS"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      expect(clone[property]).to.be.a("string");
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
