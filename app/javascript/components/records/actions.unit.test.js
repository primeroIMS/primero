import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";

import * as recordsActions from "./actions";

chai.use(sinonChai);

describe("records - Actions", () => {
  it("should have known actions", () => {
    const actions = clone(recordsActions);

    expect(actions).to.have.property("CASES_RECORDS");
    expect(actions).to.have.property("INCIDENTS_RECORDS");
    expect(actions).to.have.property("TRACING_REQUESTS_RECORDS");
    expect(actions).to.have.property("RECORDS");
    expect(actions).to.have.property("RECORDS_FAILURE");
    expect(actions).to.have.property("RECORDS_STARTED");
    expect(actions).to.have.property("RECORDS_FINISHED");
    expect(actions).to.have.property("RECORDS_SUCCESS");
    expect(actions).to.have.property("RECORD");
    expect(actions).to.have.property("RECORD_STARTED");
    expect(actions).to.have.property("RECORD_SUCCESS");
    expect(actions).to.have.property("RECORD_FINISHED");
    expect(actions).to.have.property("RECORD_FAILURE");
    expect(actions).to.have.property("SAVE_RECORD");
    expect(actions).to.have.property("SAVE_RECORD_STARTED");
    expect(actions).to.have.property("SAVE_RECORD_SUCCESS");
    expect(actions).to.have.property("SAVE_RECORD_FINISHED");
    expect(actions).to.have.property("SAVE_RECORD_FAILURE");
    expect(actions).to.have.property("DELETE_ATTACHMENT_SUCCESS");
    expect(actions).to.have.property("SAVE_ATTACHMENT_SUCCESS");
    delete actions.CASES_RECORDS;
    delete actions.INCIDENTS_RECORDS;
    delete actions.TRACING_REQUESTS_RECORDS;
    delete actions.RECORDS;
    delete actions.RECORDS_FAILURE;
    delete actions.RECORDS_STARTED;
    delete actions.RECORDS_FINISHED;
    delete actions.RECORDS_SUCCESS;
    delete actions.RECORD;
    delete actions.RECORD_STARTED;
    delete actions.RECORD_SUCCESS;
    delete actions.RECORD_FINISHED;
    delete actions.RECORD_FAILURE;
    delete actions.SAVE_RECORD;
    delete actions.SAVE_RECORD_STARTED;
    delete actions.SAVE_RECORD_SUCCESS;
    delete actions.SAVE_RECORD_FINISHED;
    delete actions.SAVE_RECORD_FAILURE;
    delete actions.DELETE_ATTACHMENT_SUCCESS;
    delete actions.SAVE_ATTACHMENT_SUCCESS;

    expect(actions).to.deep.equal({});
  });
});
