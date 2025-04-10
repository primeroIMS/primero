// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../config";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import * as actionCreators from "./action-creators";
import actions from "./actions";

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
    expect(creators).toHaveProperty("fetchReport");
    expect(creators).toHaveProperty("deleteReport");

    delete creators.fetchCasesByNationality;
    delete creators.fetchCasesByAgeAndSex;
    delete creators.fetchCasesByProtectionConcern;
    delete creators.fetchCasesByAgency;
    delete creators.fetchReport;
    delete creators.deleteReport;

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'fetchReport' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const id = 1234;

    dispatch(actionCreators.fetchReport(id));
    const firstCall = dispatch.mock.calls[0][0];

    expect(firstCall.type).toBe(actions.FETCH_REPORT);
    expect(firstCall.api.path).toBe(`reports/${id}`);
  });

  it("should check that 'deleteRole' action creator returns the correct object", () => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);

    const args = {
      id: 1,
      message: "Deleted successfully"
    };

    const expectedAction = {
      type: actions.DELETE_REPORT,
      api: {
        path: `${RECORD_PATH.reports}/1`,
        method: "DELETE",
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: "Deleted successfully",
            options: {
              key: 4,
              variant: "success"
            }
          },
          redirectWithIdFromResponse: false,
          redirect: `/${RECORD_PATH.reports}`
        }
      }
    };

    expect(actionCreators.deleteReport(args)).toEqual(expectedAction);

    jest.resetAllMocks();
  });
});
