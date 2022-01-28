import actions from "./actions";

describe("<Insights /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "FETCH_INSIGHT",
      "FETCH_INSIGHT_STARTED",
      "FETCH_INSIGHT_SUCCESS",
      "FETCH_INSIGHT_FAILURE",
      "FETCH_INSIGHT_FINISHED",
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
