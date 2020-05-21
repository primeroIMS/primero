import actions from "./actions";

describe("<LookupsForms /> - actions", () => {
  it("should have known properties", () => {
    const clone = { ...actions };

    expect(clone).to.be.an("object");
    [
      "CLEAR_SELECTED_LOOKUP",
      "FETCH_LOOKUP",
      "FETCH_LOOKUP_FAILURE",
      "FETCH_LOOKUP_FINISHED",
      "FETCH_LOOKUP_STARTED",
      "FETCH_LOOKUP_SUCCESS",
      "SAVE_LOOKUP",
      "SAVE_LOOKUP_FAILURE",
      "SAVE_LOOKUP_FINISHED",
      "SAVE_LOOKUP_STARTED",
      "SAVE_LOOKUP_SUCCESS"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
