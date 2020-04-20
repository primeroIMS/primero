import * as actions from "./actions";

describe("records - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "CASES_RECORDS",
      "DELETE_ATTACHMENT_SUCCESS",
      "INCIDENTS_RECORDS",
      "RECORD",
      "RECORDS",
      "RECORDS_FAILURE",
      "RECORDS_FINISHED",
      "RECORDS_STARTED",
      "RECORDS_SUCCESS",
      "RECORD_FAILURE",
      "RECORD_FINISHED",
      "RECORD_STARTED",
      "RECORD_SUCCESS",
      "SAVE_ATTACHMENT_SUCCESS",
      "SAVE_RECORD",
      "SAVE_RECORD_FAILURE",
      "SAVE_RECORD_FINISHED",
      "SAVE_RECORD_STARTED",
      "SAVE_RECORD_SUCCESS",
      "SERVICE_REFERRED_SAVE",
      "TRACING_REQUESTS_RECORDS"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
