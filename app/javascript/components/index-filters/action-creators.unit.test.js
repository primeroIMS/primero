// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../config";

import * as actions from "./action-creators";

describe("<IndexFilters /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actions };

    ["applyFilters", "setFilters"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'setFilters' action creator to return the correct object, when applying filters", () => {
    const options = { filter1: true };
    const expectedAction = {
      payload: options,
      type: "cases/SET_FILTERS"
    };

    expect(
      actions.setFilters({
        recordType: "cases",
        data: { filter1: true }
      })
    ).toEqual(expectedAction);
  });

  it("checks 'applyFilters' action creator returns the correct object, when applying filters/fetching records", () => {
    const options = { filter1: true };
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    actions.applyFilters({
      recordType: "cases",
      data: { filter1: true }
    })(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        payload: options,
        type: "cases/SET_FILTERS"
      })
    );

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      api: {
        db: {
          collection: "records",
          recordType: "cases"
        },
        params: options,
        path: `/${RECORD_PATH.cases}`
      },
      type: "cases/RECORDS"
    });
  });
});
