// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../config";

import {
  CLEAR_METADATA,
  FETCH_REPORTS_SUCCESS,
  FETCH_REPORTS_STARTED,
  FETCH_REPORTS_FINISHED,
  FETCH_REPORTS_FAILURE
} from "./actions";
import reducer from "./reducer";

describe("<Reports /> - Reducers", () => {
  const initialState = fromJS({});

  it("deprecated Reports/CASES_BY_NATIONALITY", () => {
    const action = {
      type: "Reports/CASES_BY_NATIONALITY", // deprecated
      payload: {
        casesByNationality: {
          title: "Cases by Nationality",
          column_name: "Nationality",
          description: "Number of cases broken down by nationality",
          data: {
            Nicaragua: 1,
            Argentina: 2,
            Alemania: 3
          }
        }
      }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(initialState);
  });

  it("deprecated Reports/CASES_BY_AGE_AND_SEX", () => {
    const action = {
      type: "Reports/CASES_BY_AGE_AND_SEX", // deprecated
      payload: {
        casesByAgeAndSex: {
          title: "Cases by Age and Sex",
          column_name: "Age",
          description: "Number of cases broken down by age and sex",
          data: {
            "0-5": {
              Female: 3,
              Male: 6,
              Other: 0
            },
            "6-11": {
              Female: 1,
              Male: 13,
              Other: 0
            },
            "12-17": {
              Female: 19,
              Male: 29,
              Other: 1
            },
            "18+": {
              Female: 7,
              Male: 10,
              Other: 0
            }
          }
        }
      }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(initialState);
  });

  it("deprecated Reports/CASES_BY_PROTECTION_CONCERN", () => {
    const action = {
      type: "Reports/CASES_BY_PROTECTION_CONCERN", // deprecated
      payload: {
        casesByProtectionConcern: {
          title: "Cases by Protection Concern",
          column_name: "Protection Concern",
          description: "Number of cases broken down by protection concern and sex",
          data: {
            "HIGH VULNERABILITY TO ABUSE": {
              Female: 4,
              Male: 0
            },
            "AFFILIATED / ASSOCIATED TO STIGMATIZED PARENTS": {
              Female: 2,
              Male: 0
            },
            "IN CONFLICT WITH THE LAW": {
              Female: 7,
              Male: 0
            },
            "DELINQUENT BEHAVIOR": {
              Female: 4,
              Male: 0
            },
            "HIGH VULNERABILITY TO EXPLOITATION": {
              Female: 3,
              Male: 1
            }
          }
        }
      }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(initialState);
  });

  it("deprecated Reports/CASES_BY_AGENCY", () => {
    const action = {
      type: "Reports/CASES_BY_AGENCY", // deprecated
      payload: {
        casesByAgency: {
          title: "Cases by Agency",
          column_name: "Agency",
          description: "Number of cases broken down by agency",
          data: {
            UNICEF: 3,
            "SAVE THE CHILDREN": 5,
            DOLSA: 1
          }
        }
      }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(initialState);
  });

  it("should handle FETCH_REPORTS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });
    const action = {
      type: FETCH_REPORTS_STARTED,
      payload: true
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_REPORTS_SUCCESS", () => {
    const data = [
      {
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar"
      }
    ];
    const expected = fromJS({
      data,
      errors: false,
      metadata: {
        total: 17,
        per: 20,
        page: 1
      }
    });
    const action = {
      type: FETCH_REPORTS_SUCCESS,
      payload: {
        data,
        metadata: {
          total: 17,
          per: 20,
          page: 1
        }
      }
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_REPORTS_FINISHED", () => {
    const expected = fromJS({
      loading: false
    });
    const action = {
      type: FETCH_REPORTS_FINISHED,
      payload: false
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_REPORTS_FAILURE", () => {
    const expected = fromJS({
      errors: true
    });
    const action = {
      type: FETCH_REPORTS_FAILURE,
      payload: true
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle CLEAR_METADATA", () => {
    const expected = fromJS({
      metadata: DEFAULT_METADATA
    });

    const action = {
      type: CLEAR_METADATA
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });
});
