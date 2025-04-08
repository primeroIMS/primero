// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";
import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../../config";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<Dashboard /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    [
      "fetchFlags",
      "fetchCasesByStatus",
      "fetchCasesByCaseWorker",
      "fetchCasesRegistration",
      "fetchCasesOverview",
      "fetchServicesStatus",
      "openPageActions",
      "fetchDashboards"
    ].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'fetchDashboards' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.fetchDashboards());

    expect(dispatch.mock.calls[0][0].type).toEqual(actions.DASHBOARDS);

    expect(dispatch.mock.calls[0][0].api.path).toEqual(RECORD_PATH.dashboards);
  });

  describe("fetchFlags", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const commonPath = "record_type=cases";

    describe("when only activeFlags is false", () => {
      it("should return the correct object", () => {
        const expected = { type: "dashboard/DASHBOARD_FLAGS", api: { path: `flags?${commonPath}` } };

        dispatch(actionCreators.fetchFlags("cases"));
        const firstCallReturnValue = dispatch.mock.calls[0][0];

        expect(firstCallReturnValue).toEqual(expected);
      });
    });

    describe("when only activeFlags is true", () => {
      it("should return the correct object", () => {
        const expected = { type: "dashboard/DASHBOARD_FLAGS", api: { path: `flags?active_only=true&${commonPath}` } };

        dispatch(actionCreators.fetchFlags("cases", true));
        const firstCallReturnValue = dispatch.mock.calls[0][0];

        expect(firstCallReturnValue).toEqual(expected);
      });
    });
  });
});
