import { expect } from "../../../../test/unit-test-helpers";
import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<AgenciesList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchAgencies"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchAgencies' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.AGENCIES,
      api: {
        params: undefined,
        path: RECORD_PATH.agencies
      }
    };

    expect(actionsCreators.fetchAgencies()).to.deep.equal(expectedAction);
  });
});
