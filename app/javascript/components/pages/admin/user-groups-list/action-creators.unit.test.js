import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<UserGroupsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["fetchUserGroups", "setUserGroupsFilter"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check fetchUserGroups return the correct object", () => {
    const data = { per: 1, managed: true };

    const expectedAction = {
      type: actions.USER_GROUPS,
      api: {
        params: data,
        path: "user_groups"
      }
    };

    expect(actionCreators.fetchUserGroups({ data })).to.deep.equal(expectedAction);
  });

  it("should check that 'setUserGroupsFilter' action creator returns the correct object", () => {
    const payload = { data: { disabled: ["true", "false"] } };
    const expectedAction = {
      type: actions.SET_USER_GROUPS_FILTER,
      payload
    };

    expect(actionCreators.setUserGroupsFilter(payload)).to.deep.equal(expectedAction);
  });
});
