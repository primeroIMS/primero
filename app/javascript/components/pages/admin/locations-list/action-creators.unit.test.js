import { fromJS } from "immutable";

import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<LocationsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchLocations", "setLocationsFilter"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchLocations' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.LOCATIONS,
      api: {
        params: fromJS({ hierarchy: true }),
        path: RECORD_PATH.locations
      }
    };

    expect(actionsCreators.fetchLocations().api.params.toJS()).to.deep.equal(expectedAction.api.params.toJS());
  });

  it("should check that 'setLocationsFilter' action creator returns the correct object", () => {
    const payload = { data: { disabled: ["true", "false"] } };
    const expectedAction = {
      type: actions.SET_LOCATIONS_FILTER,
      payload
    };

    expect(actionsCreators.setLocationsFilter(payload)).to.deep.equal(expectedAction);
  });
});
