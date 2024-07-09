// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const clone = { ...actionCreators };

    expect(clone, "DEPRECATED fetchCasesByNationality").to.not.have.property("fetchCasesByNationality");
    expect(clone, "DEPRECATED fetchCasesByAgeAndSex").to.not.have.property("fetchCasesByAgeAndSex");
    expect(clone, "DEPRECATED fetchCasesByProtectionConcern").to.not.have.property("fetchCasesByProtectionConcern");
    expect(clone, "DEPRECATED fetchCasesByAgency").to.not.have.property("fetchCasesByAgency");

    ["clearFilters", "fetchInsights", "setFilters"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    delete clone.fetchCasesByNationality;
    delete clone.fetchCasesByAgeAndSex;
    delete clone.fetchCasesByProtectionConcern;
    delete clone.fetchCasesByAgency;
    delete clone.fetchInsights;

    expect(clone).to.be.empty;
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

    expect(actionCreators.fetchInsights(metadata)).to.deep.equals(expected);
  });

  it("should check the 'setFilters' action creator to return the correct object", () => {
    const filters = { subreport_id: "subreport-1" };

    const expected = {
      type: actions.SET_INSIGHT_FILTERS,
      payload: filters
    };

    expect(actionCreators.setFilters(filters)).to.deep.equals(expected);
  });

  it("should check the 'clearFilters' action creator to return the correct object", () => {
    const expected = { type: actions.CLEAR_INSIGHT_FILTERS };

    expect(actionCreators.clearFilters()).to.deep.equals(expected);
  });
});
