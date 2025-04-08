// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import { FETCH_REPORTS } from "./actions";

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    // DEPRECATED fetchCasesByNationality
    expect(creators).not.toHaveProperty("fetchCasesByNationality");
    // DEPRECATED fetchCasesByAgeAndSex
    expect(creators).not.toHaveProperty("fetchCasesByAgeAndSex");
    // DEPRECATED fetchCasesByProtectionConcern
    expect(creators).not.toHaveProperty("fetchCasesByProtectionConcern");
    // DEPRECATED fetchCasesByAgency
    expect(creators).not.toHaveProperty("fetchCasesByAgency");
    expect(creators).toHaveProperty("fetchReports");

    delete creators.fetchCasesByNationality;
    delete creators.fetchCasesByAgeAndSex;
    delete creators.fetchCasesByProtectionConcern;
    delete creators.fetchCasesByAgency;
    delete creators.fetchReports;

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'fetchReports' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const metadata = { data: { page: 1, per: 20 } };

    dispatch(actionCreators.fetchReports(metadata));
    const firstCall = dispatch.mock.calls[0][0];

    expect(firstCall.type).toBe(FETCH_REPORTS);
    expect(firstCall.api.path).toBe("reports");
    expect(firstCall.api.params).toEqual(metadata.data);
  });
});
