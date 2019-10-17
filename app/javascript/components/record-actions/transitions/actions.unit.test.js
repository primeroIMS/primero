import "test/test.setup";
import { expect } from "chai";
import clone from "lodash/clone";
import * as actions from "./actions";

describe("<Transitions /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone(actions);
    expect(cloneActions).to.have.property("ASSIGN_USERS_FETCH");
    expect(cloneActions).to.have.property("ASSIGN_USERS_FETCH_SUCCESS");
    expect(cloneActions).to.have.property("CLEAR_ERRORS");
    expect(cloneActions).to.have.property("ASSIGN_USER_SAVE");
    expect(cloneActions).to.have.property("ASSIGN_USER_SAVE_SUCCESS");
    expect(cloneActions).to.have.property("ASSIGN_USER_SAVE_STARTED");
    expect(cloneActions).to.have.property("ASSIGN_USER_SAVE_FAILURE");
    expect(cloneActions).to.have.property("ASSIGN_USER_SAVE_FINISHED");
    expect(cloneActions).to.have.property("TRANSFER_USERS_FETCH");
    expect(cloneActions).to.have.property("TRANSFER_USERS_FETCH_SUCCESS");
    expect(cloneActions).to.have.property("TRANSFER_USER");
    expect(cloneActions).to.have.property("TRANSFER_USER_SUCCESS");
    expect(cloneActions).to.have.property("TRANSFER_USER_STARTED");
    expect(cloneActions).to.have.property("TRANSFER_USER_FAILURE");

    delete cloneActions.ASSIGN_USERS_FETCH;
    delete cloneActions.ASSIGN_USERS_FETCH_SUCCESS;
    delete cloneActions.CLEAR_ERRORS;
    delete cloneActions.ASSIGN_USER_SAVE;
    delete cloneActions.ASSIGN_USER_SAVE_SUCCESS;
    delete cloneActions.ASSIGN_USER_SAVE_STARTED;
    delete cloneActions.ASSIGN_USER_SAVE_FAILURE;
    delete cloneActions.ASSIGN_USER_SAVE_FINISHED;
    delete cloneActions.TRANSFER_USERS_FETCH;
    delete cloneActions.TRANSFER_USERS_FETCH_SUCCESS;
    delete cloneActions.TRANSFER_USER;
    delete cloneActions.TRANSFER_USER_SUCCESS;
    delete cloneActions.TRANSFER_USER_STARTED;
    delete cloneActions.TRANSFER_USER_FAILURE;

    expect(cloneActions).to.deep.equal({});
  });
});
