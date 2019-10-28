import { expect } from "test/chai-helpers";
import clone from "lodash/clone";
import * as actions from "./actions";

describe("<Reports /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone(actions);
    expect(cloneActions).to.have.property("FETCH_REPORT");
    expect(cloneActions).to.have.property("FETCH_REPORT_STARTED");
    expect(cloneActions).to.have.property("FETCH_REPORT_SUCCESS");
    expect(cloneActions).to.have.property("FETCH_REPORT_FAILURE");
    expect(cloneActions).to.have.property("FETCH_REPORT_FINISHED");

    delete cloneActions.FETCH_REPORT;
    delete cloneActions.FETCH_REPORT_STARTED;
    delete cloneActions.FETCH_REPORT_SUCCESS;
    delete cloneActions.FETCH_REPORT_FAILURE;
    delete cloneActions.FETCH_REPORT_FINISHED;

    expect(cloneActions).to.be.empty;
  });
});
