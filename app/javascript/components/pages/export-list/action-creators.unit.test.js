// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { EXPORT_URL } from "./constants";
import actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<ExportList /> - pages/export-list/action-creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["fetchExports"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'fetchExports' action creator to return the correct object", () => {
    const params = {
      data: { per: 20, page: 1 }
    };
    const returnObject = actionCreators.fetchExports(params);
    const expected = {
      type: actions.FETCH_EXPORTS,
      api: {
        path: EXPORT_URL,
        params: params.data
      }
    };

    expect(returnObject).toBeDefined();
    expect(returnObject).toEqual(expected);
  });
});
