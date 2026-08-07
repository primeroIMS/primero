import actions from "./actions";

describe("<UsersList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    [
      "CLEAR_METADATA",
      "USERS",
      "USERS_FINISHED",
      "USERS_STARTED",
      "USERS_SUCCESS",
      "SET_USERS_FILTER",
      "DISABLE_USERS",
      "DISABLE_USERS_STARTED",
      "DISABLE_USERS_SUCCESS",
      "DISABLE_USERS_FAILURE",
      "DISABLE_USERS_FINISHED",
      "SEND_EMAILS",
      "SEND_EMAILS_STARTED",
      "SEND_EMAILS_SUCCESS",
      "SEND_EMAILS_FAILURE",
      "SEND_EMAILS_FINISHED"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
