// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<AgenciesList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchAgencies", "setAgenciesFilter"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'fetchAgencies' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.AGENCIES,
      api: {
        params: {
          managed: true
        },
        path: RECORD_PATH.agencies
      }
    };

    expect(actionsCreators.fetchAgencies()).toEqual(expectedAction);
  });

  it("should check that 'setAgenciesFilter' action creator returns the correct object", () => {
    const payload = { data: { disabled: ["true", "false"] } };
    const expectedAction = {
      type: actions.SET_AGENCIES_FILTER,
      payload
    };

    expect(actionsCreators.setAgenciesFilter(payload)).toEqual(expectedAction);
  });
});
