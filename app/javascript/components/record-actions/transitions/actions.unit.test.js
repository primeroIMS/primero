import "test/test.setup";
import { expect } from "chai";
import * as actions from "./actions";
import NAMESPACE from "./namespace";

describe("<Transitions /> - Actions", () => {
  it("should have known actions", () => {
    expect(actions).to.have.property("ASSIGN_USERS_FETCH");
    expect(actions).to.have.property("ASSIGN_USERS_FETCH_SUCCESS");
    expect(actions).to.have.property("CLEAR_ERRORS");
    expect(actions).to.have.property("ASSIGN_USER_SAVE");
    expect(actions).to.have.property("ASSIGN_USER_SAVE_SUCCESS");
    expect(actions).to.have.property("ASSIGN_USER_SAVE_STARTED");
    expect(actions).to.have.property("ASSIGN_USER_SAVE_FAILURE");
    expect(actions).to.have.property("ASSIGN_USER_SAVE_FINISHED");
    expect(actions).to.have.property("TRANSFER_USERS_FETCH");
    expect(actions).to.have.property("TRANSFER_USERS_FETCH_SUCCESS");
    expect(actions).to.have.property("TRANSFER_USER");
    expect(actions).to.have.property("TRANSFER_USER_SUCCESS");
    expect(actions).to.have.property("TRANSFER_USER_STARTED");
    expect(actions).to.have.property("TRANSFER_USER_FAILURE");
  });

  it("should have correct action value", () => {
    expect(actions.ASSIGN_USERS_FETCH).equal(`${NAMESPACE}/ASSIGN_USERS_FETCH`);
    expect(actions.ASSIGN_USERS_FETCH_SUCCESS).equal(
      `${NAMESPACE}/ASSIGN_USERS_FETCH_SUCCESS`
    );
    expect(actions.CLEAR_ERRORS).equal(`${NAMESPACE}/CLEAR_ERRORS`);
    expect(actions.ASSIGN_USER_SAVE).equal(`${NAMESPACE}/ASSIGN_USER_SAVE`);
    expect(actions.ASSIGN_USER_SAVE_SUCCESS).equal(
      `${NAMESPACE}/ASSIGN_USER_SAVE_SUCCESS`
    );
    expect(actions.ASSIGN_USER_SAVE_STARTED).equal(
      `${NAMESPACE}/ASSIGN_USER_SAVE_STARTED`
    );
    expect(actions.ASSIGN_USER_SAVE_FAILURE).equal(
      `${NAMESPACE}/ASSIGN_USER_SAVE_FAILURE`
    );
    expect(actions.ASSIGN_USER_SAVE_FINISHED).equal(
      `${NAMESPACE}/ASSIGN_USER_SAVE_FINISHED`
    );
    expect(actions.TRANSFER_USERS_FETCH).equal(
      `${NAMESPACE}/TRANSFER_USERS_FETCH`
    );
    expect(actions.TRANSFER_USERS_FETCH_SUCCESS).equal(
      `${NAMESPACE}/TRANSFER_USERS_FETCH_SUCCESS`
    );
    expect(actions.TRANSFER_USER).equal(`${NAMESPACE}/TRANSFER_USER`);
    expect(actions.TRANSFER_USER_SUCCESS).equal(
      `${NAMESPACE}/TRANSFER_USER_SUCCESS`
    );
    expect(actions.TRANSFER_USER_STARTED).equal(
      `${NAMESPACE}/TRANSFER_USER_STARTED`
    );
    expect(actions.TRANSFER_USER_FAILURE).equal(
      `${NAMESPACE}/TRANSFER_USER_FAILURE`
    );
  });
});
