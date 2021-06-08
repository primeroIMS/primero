import appendDisabledUser from "./append-disabled-user";

describe("appendDisabledUser", () => {
  it("should append the user if not present in the users list", () => {
    const users = [
      { id: "user-1", display_text: "user-1" },
      { id: "user-2", display_text: "user-2" }
    ];
    const expected = [...users, { id: "user-3", display_text: "user-3", disabled: true }];
    const options = appendDisabledUser(users, "user-3");

    expect(options).to.deep.equal(expected);
  });
});
