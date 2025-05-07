// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const clone = { ...actionCreators };

    // DEPRECATED fetchCasesByNationality
    expect(clone).not.toHaveProperty("fetchCasesByNationality");
    // DEPRECATED fetchCasesByAgeAndSex
    expect(clone).not.toHaveProperty("fetchCasesByAgeAndSex");
    // DEPRECATED fetchCasesByProtectionConcern
    expect(clone).not.toHaveProperty("fetchCasesByProtectionConcern");
    // DEPRECATED fetchCasesByAgency
    expect(clone).not.toHaveProperty("fetchCasesByAgency");

    ["clearFilters", "fetchInsights", "setFilters"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    delete clone.fetchCasesByNationality;
    delete clone.fetchCasesByAgeAndSex;
    delete clone.fetchCasesByProtectionConcern;
    delete clone.fetchCasesByAgency;
    delete clone.fetchInsights;

    expect(Object.keys(clone)).toHaveLength(0);
  });

  it("should check the 'fetchInsights' action creator to return the correct object", () => {
    const metadata = { data: { page: 1, per: 20 } };

    const expected = {
      type: actions.FETCH_INSIGHTS,
      api: {
        path: "managed_reports",
        params: metadata.data
      }
    };

    expect(actionCreators.fetchInsights(metadata)).toEqual(expected);
  });

  it("should check the 'setFilters' action creator to return the correct object", () => {
    const filters = { subreport_id: "subreport-1" };

    const expected = {
      type: actions.SET_INSIGHT_FILTERS,
      payload: filters
    };

    expect(actionCreators.setFilters(filters)).toEqual(expected);
  });

  it("should check the 'clearFilters' action creator to return the correct object", () => {
    const expected = { type: actions.CLEAR_INSIGHT_FILTERS };

    expect(actionCreators.clearFilters()).toEqual(expected);
  });
});
