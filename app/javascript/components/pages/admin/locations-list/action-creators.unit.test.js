import { fromJS } from "immutable";

import { ENQUEUE_SNACKBAR } from "../../../notifier";
import { RECORD_PATH } from "../../../../config";
import { CLEAR_DIALOG } from "../../../action-dialog";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<LocationsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["disableLocations", "fetchLocations", "setLocationsFilter"].forEach(property => {
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

  it("should check that 'disableLocations' action creator returns the correct object", () => {
    const filterParams = fromJS({ hierarchy: true });

    const expectedAction = {
      type: actions.DISABLE_LOCATIONS,
      api: {
        method: "POST",
        path: "locations/update_bulk",
        body: {
          data: [
            { id: 1, disabled: true },
            { id: 2, disabled: true }
          ]
        },
        successCallback: [
          { action: actions.LOCATIONS, api: { path: "locations", params: filterParams } },
          { action: CLEAR_DIALOG },
          {
            action: ENQUEUE_SNACKBAR,
            payload: { message: "Success message", options: { variant: "success", key: "success-message" } }
          }
        ]
      }
    };

    expect(actionsCreators.disableLocations([1, 2], filterParams, "Success message")).to.deep.equal(expectedAction);
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
