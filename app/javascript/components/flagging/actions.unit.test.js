import constants from "./actions";

describe("Flagging - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    [
      "FETCH_FLAGS",
      "FETCH_FLAGS_SUCCESS",
      "UNFLAG",
      "UNFLAG_SUCCESS",
      "ADD_FLAG",
      "ADD_FLAG_SUCCESS",
      "SET_SELECTED_FLAG",
      "SET_SELECTED_FLAG_SUCCESS",
      "FETCH_FLAGS_STARTED",
      "FETCH_FLAGS_FINISHED"
    ].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
