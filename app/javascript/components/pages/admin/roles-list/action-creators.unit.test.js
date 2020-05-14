import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<RolesList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchRoles"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchRoles' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.ROLES,
      api: {
        params: undefined,
        path: RECORD_PATH.roles
      }
    };

    expect(actionsCreators.fetchRoles()).to.deep.equal(expectedAction);
  });
});
