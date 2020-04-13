import * as actions from "./action-creators";

describe("<UserGroupsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actions };

    ["fetchUserGroups"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check fetchUserGroups return the correct object", () => {
    const options = { per: 1 };

    const expectedAction = {
      type: "user_groups/USER_GROUPS",
      api: {
        params: options,
        path: "user_groups"
      }
    };

    expect(actions.fetchUserGroups({ options })).to.deep.equal(expectedAction);
  });
});
