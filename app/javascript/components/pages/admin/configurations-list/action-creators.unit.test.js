// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";
import * as actionsCreators from "./action-creators";

describe("configurations-list/actions-creators.js", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchConfigurations"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check fetchConfigurations return the correct object", () => {
    const data = { per: 1 };

    const expectedAction = {
      type: actions.FETCH_CONFIGURATIONS,
      api: {
        params: data,
        path: RECORD_PATH.configurations
      }
    };

    expect(actionsCreators.fetchConfigurations({ data })).toEqual(expectedAction);
  });
});
