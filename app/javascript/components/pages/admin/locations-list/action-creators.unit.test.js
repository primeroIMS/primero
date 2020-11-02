import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<LocationsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchLocations"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchLocations' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.LOCATIONS,
      api: {
        params: { hierarchy: true },
        path: RECORD_PATH.locations
      }
    };

    expect(actionsCreators.fetchLocations()).to.deep.equal(expectedAction);
  });
});
